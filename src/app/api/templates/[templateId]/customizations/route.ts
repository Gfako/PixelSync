import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { TemplateCustomization, TemplateCustomizationData } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookies) {
            cookies.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );
    
    // Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId } = params;

    // Get template customizations for the user and template
    const { data: customization, error } = await supabase
      .from('template_customizations')
      .select('*')
      .eq('template_id', templateId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching template customizations:', error);
      return NextResponse.json({ error: 'Failed to fetch customizations' }, { status: 500 });
    }

    // If no customization found, return default values
    if (!customization) {
      return NextResponse.json({ 
        customization: null,
        isDefault: true 
      });
    }

    return NextResponse.json({ 
      customization,
      isDefault: false 
    });

  } catch (error) {
    console.error('Error in GET /api/templates/[templateId]/customizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookies) {
            cookies.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );
    
    // Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId } = params;
    const customizationData: TemplateCustomizationData = await request.json();

    // Check if customization already exists
    const { data: existing } = await supabase
      .from('template_customizations')
      .select('id')
      .eq('template_id', templateId)
      .eq('user_id', user.id)
      .single();

    let result;

    if (existing) {
      // Update existing customization
      const { data, error } = await supabase
        .from('template_customizations')
        .update({
          ...customizationData,
          template_id: templateId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .eq('user_id', user.id)
        .select()
        .single();

      result = { data, error };
    } else {
      // Create new customization
      const { data, error } = await supabase
        .from('template_customizations')
        .insert({
          ...customizationData,
          template_id: templateId,
          user_id: user.id
        })
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      console.error('Error saving template customizations:', result.error);
      return NextResponse.json({ error: 'Failed to save customizations' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      customization: result.data 
    });

  } catch (error) {
    console.error('Error in POST /api/templates/[templateId]/customizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookies) {
            cookies.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );
    
    // Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId } = params;

    // Delete the customization
    const { error } = await supabase
      .from('template_customizations')
      .delete()
      .eq('template_id', templateId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting template customizations:', error);
      return NextResponse.json({ error: 'Failed to delete customizations' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in DELETE /api/templates/[templateId]/customizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}