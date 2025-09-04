import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import OpenAI from 'openai'
import { createServiceClient } from './supabase'

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface RecordingMetadata {
  meetingId: string
  fileName: string
  fileSize: number
  durationSeconds: number
  format: string
  quality: string
}

export class RecordingService {
  private static bucketName = process.env.S3_BUCKET_NAME!

  // Upload recording to S3
  static async uploadRecording(
    recordingBuffer: Buffer,
    metadata: RecordingMetadata
  ): Promise<{
    success: boolean
    storageUrl?: string
    error?: string
  }> {
    try {
      const key = `recordings/${metadata.meetingId}/${metadata.fileName}`
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: recordingBuffer,
        ContentType: this.getContentType(metadata.format),
        Metadata: {
          meetingId: metadata.meetingId,
          duration: metadata.durationSeconds.toString(),
          uploadedAt: new Date().toISOString()
        }
      })

      await s3Client.send(command)
      const storageUrl = `s3://${this.bucketName}/${key}`

      // Store metadata in database
      const supabase = createServiceClient()
      const { error: dbError } = await supabase
        .from('meeting_recordings')
        .insert({
          meeting_id: metadata.meetingId,
          file_name: metadata.fileName,
          file_size: metadata.fileSize,
          duration_seconds: metadata.durationSeconds,
          storage_url: storageUrl,
          transcription_status: 'pending'
        })

      if (dbError) {
        console.error('Database error storing recording metadata:', dbError)
      }

      return {
        success: true,
        storageUrl
      }
    } catch (error: any) {
      console.error('Error uploading recording:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate signed URL for recording access
  static async generateDownloadUrl(
    meetingId: string,
    fileName: string,
    expiresIn: number = 3600 // 1 hour
  ): Promise<string | null> {
    try {
      const key = `recordings/${meetingId}/${fileName}`
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })
      
      // Update database with download URL
      const supabase = createServiceClient()
      await supabase
        .from('meeting_recordings')
        .update({ download_url: signedUrl })
        .eq('meeting_id', meetingId)
        .eq('file_name', fileName)

      return signedUrl
    } catch (error) {
      console.error('Error generating download URL:', error)
      return null
    }
  }

  // Transcribe recording using OpenAI Whisper
  static async transcribeRecording(
    meetingId: string,
    fileName: string
  ): Promise<{
    success: boolean
    transcription?: string
    error?: string
  }> {
    try {
      // Get recording from S3
      const key = `recordings/${meetingId}/${fileName}`
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })

      const response = await s3Client.send(command)
      const audioBuffer = await response.Body?.transformToByteArray()
      
      if (!audioBuffer) {
        throw new Error('Failed to retrieve recording from storage')
      }

      // Create File-like object for OpenAI API
      const audioFile = new File([audioBuffer], fileName, {
        type: this.getContentType(this.getFileExtension(fileName))
      })

      // Transcribe with OpenAI Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment']
      })

      const transcriptionText = transcription.text

      // Update database with transcription
      const supabase = createServiceClient()
      await supabase
        .from('meeting_recordings')
        .update({
          transcription_status: 'completed'
        })
        .eq('meeting_id', meetingId)
        .eq('file_name', fileName)

      // Store transcription in meetings table
      await supabase
        .from('meetings')
        .update({
          transcription_text: transcriptionText
        })
        .eq('id', meetingId)

      return {
        success: true,
        transcription: transcriptionText
      }
    } catch (error: any) {
      console.error('Error transcribing recording:', error)
      
      // Update status to failed
      const supabase = createServiceClient()
      await supabase
        .from('meeting_recordings')
        .update({
          transcription_status: 'failed'
        })
        .eq('meeting_id', meetingId)
        .eq('file_name', fileName)

      return {
        success: false,
        error: error.message
      }
    }
  }

  // Summarize transcription using OpenAI GPT
  static async summarizeTranscription(
    transcription: string,
    meetingTitle: string
  ): Promise<{
    success: boolean
    summary?: string
    error?: string
  }> {
    try {
      const prompt = `
Please provide a comprehensive summary of this meeting transcript. Include:

1. **Key Discussion Points**: Main topics discussed
2. **Decisions Made**: Any decisions or conclusions reached
3. **Action Items**: Tasks assigned or next steps identified
4. **Participants**: Key contributors to the discussion
5. **Follow-up Required**: Any pending items or future meetings needed

Meeting Title: ${meetingTitle}

Transcript:
${transcription}

Please format the summary in a clear, professional manner with bullet points where appropriate.
`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional meeting assistant that creates clear, concise meeting summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })

      const summary = completion.choices[0]?.message?.content

      if (!summary) {
        throw new Error('Failed to generate summary')
      }

      return {
        success: true,
        summary
      }
    } catch (error: any) {
      console.error('Error summarizing transcription:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Process recording: upload, transcribe, and summarize
  static async processRecording(
    recordingBuffer: Buffer,
    metadata: RecordingMetadata,
    meetingTitle: string,
    enableTranscription: boolean = true
  ): Promise<{
    success: boolean
    storageUrl?: string
    transcription?: string
    summary?: string
    error?: string
  }> {
    try {
      // Upload recording
      const uploadResult = await this.uploadRecording(recordingBuffer, metadata)
      if (!uploadResult.success) {
        return uploadResult
      }

      let transcription: string | undefined
      let summary: string | undefined

      if (enableTranscription) {
        // Transcribe recording
        const transcriptionResult = await this.transcribeRecording(
          metadata.meetingId,
          metadata.fileName
        )

        if (transcriptionResult.success && transcriptionResult.transcription) {
          transcription = transcriptionResult.transcription

          // Generate summary
          const summaryResult = await this.summarizeTranscription(
            transcription,
            meetingTitle
          )

          if (summaryResult.success) {
            summary = summaryResult.summary

            // Update meeting with summary
            const supabase = createServiceClient()
            await supabase
              .from('meetings')
              .update({ summary })
              .eq('id', metadata.meetingId)
          }
        }
      }

      return {
        success: true,
        storageUrl: uploadResult.storageUrl,
        transcription,
        summary
      }
    } catch (error: any) {
      console.error('Error processing recording:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  private static getContentType(format: string): string {
    const contentTypes: { [key: string]: string } = {
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'webm': 'video/webm',
      'm4a': 'audio/mp4'
    }
    return contentTypes[format.toLowerCase()] || 'application/octet-stream'
  }

  private static getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || ''
  }
}

// Webhook handler for Zoom recording completion
export class ZoomRecordingWebhook {
  static async handleRecordingCompleted(webhookData: any) {
    try {
      const { object } = webhookData
      const meetingId = object.id.toString()
      const recordingFiles = object.recording_files || []

      for (const file of recordingFiles) {
        if (file.file_type === 'MP4' || file.file_type === 'M4A') {
          // Download recording from Zoom
          const { ZoomService } = await import('./meeting-platforms')
          const recordingBuffer = await ZoomService.downloadRecording(
            file.id,
            file.download_url
          )

          const metadata: RecordingMetadata = {
            meetingId,
            fileName: `zoom_recording_${file.id}.${file.file_extension}`,
            fileSize: file.file_size,
            durationSeconds: Math.floor(file.play_time / 1000),
            format: file.file_extension,
            quality: 'standard'
          }

          // Process the recording
          const result = await RecordingService.processRecording(
            recordingBuffer,
            metadata,
            object.topic || 'Zoom Meeting',
            true // Enable transcription
          )

          if (!result.success) {
            console.error('Failed to process Zoom recording:', result.error)
          }
        }
      }
    } catch (error) {
      console.error('Error handling Zoom recording webhook:', error)
    }
  }
}