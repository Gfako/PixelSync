import { TemplateCustomization, TemplateCustomizationData, DEFAULT_TEMPLATE_CUSTOMIZATION } from '@/types';

/**
 * Template customization service for loading and saving design settings
 */
export class TemplateCustomizationService {
  private static baseUrl = '/api/templates';

  /**
   * Load template customizations for a specific template
   */
  static async loadCustomizations(templateId: string): Promise<TemplateCustomization | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}/customizations`);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please sign in');
        }
        throw new Error('Failed to load customizations');
      }

      const { customization, isDefault } = await response.json();
      
      // Return null if no customization exists (will use defaults)
      if (isDefault || !customization) {
        return null;
      }

      return customization;
    } catch (error) {
      console.error('Error loading template customizations:', error);
      throw error;
    }
  }

  /**
   * Save template customizations
   */
  static async saveCustomizations(
    templateId: string, 
    customizationData: TemplateCustomizationData
  ): Promise<TemplateCustomization> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}/customizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customizationData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please sign in');
        }
        throw new Error('Failed to save customizations');
      }

      const { customization } = await response.json();
      return customization;
    } catch (error) {
      console.error('Error saving template customizations:', error);
      throw error;
    }
  }

  /**
   * Delete template customizations (reset to default)
   */
  static async deleteCustomizations(templateId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}/customizations`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please sign in');
        }
        throw new Error('Failed to delete customizations');
      }
    } catch (error) {
      console.error('Error deleting template customizations:', error);
      throw error;
    }
  }

  /**
   * Convert design settings from editor to API format
   */
  static convertEditorToApi(designSettings: any): TemplateCustomizationData {
    return {
      template_id: designSettings.templateId || '1',
      template_name: designSettings.templateName,
      event_title: designSettings.eventTitle,
      description: designSettings.description,
      duration_minutes: designSettings.durationMinutes,
      timezone: designSettings.timezone,
      
      // Design settings - Colors
      page_background_color: designSettings.pageBackgroundColor,
      background_color: designSettings.backgroundColor,
      calendar_background_color: designSettings.calendarBackgroundColor,
      time_slot_button_color: designSettings.timeSlotButtonColor,
      primary_color: designSettings.primaryColor,
      text_color: designSettings.textColor,
      calendar_text_color: designSettings.calendarTextColor,
      
      // Design settings - Typography
      font_family: designSettings.fontFamily,
      font_weight: designSettings.fontWeight,
      
      // Design settings - Border radius
      border_radius: designSettings.borderRadius,
      calendar_border_radius: designSettings.calendarBorderRadius,
      button_border_radius: designSettings.buttonBorderRadius,
      
      // Media settings
      show_avatar: designSettings.showAvatar,
      avatar_url: designSettings.avatarUrl,
      show_cover_photo: designSettings.showCoverPhoto,
      cover_photo: designSettings.coverPhoto,
      
      // Custom components
      custom_text_components: designSettings.customTextComponents || [],
      accordion_components: designSettings.accordionComponents || []
    };
  }

  /**
   * Convert API format to editor design settings
   */
  static convertApiToEditor(customization: TemplateCustomization): any {
    return {
      templateId: customization.template_id,
      templateName: customization.template_name,
      eventTitle: customization.event_title,
      description: customization.description,
      duration: customization.duration_minutes < 60 
        ? `${customization.duration_minutes} min` 
        : `${customization.duration_minutes / 60}h`,
      durationMinutes: customization.duration_minutes,
      timezone: customization.timezone,
      
      // Design settings - Colors
      pageBackgroundColor: customization.page_background_color,
      backgroundColor: customization.background_color,
      calendarBackgroundColor: customization.calendar_background_color,
      timeSlotButtonColor: customization.time_slot_button_color,
      primaryColor: customization.primary_color,
      textColor: customization.text_color,
      calendarTextColor: customization.calendar_text_color,
      
      // Design settings - Typography
      fontFamily: customization.font_family,
      fontWeight: customization.font_weight,
      
      // Design settings - Border radius
      borderRadius: customization.border_radius,
      calendarBorderRadius: customization.calendar_border_radius,
      buttonBorderRadius: customization.button_border_radius,
      
      // Media settings
      showAvatar: customization.show_avatar,
      avatarUrl: customization.avatar_url,
      showCoverPhoto: customization.show_cover_photo,
      coverPhoto: customization.cover_photo,
      
      // Custom components
      customTextComponents: customization.custom_text_components || [],
      accordionComponents: customization.accordion_components || []
    };
  }

  /**
   * Get default design settings
   */
  static getDefaultSettings(): any {
    return {
      templateId: '1',
      eventTitle: DEFAULT_TEMPLATE_CUSTOMIZATION.event_title,
      description: DEFAULT_TEMPLATE_CUSTOMIZATION.description,
      duration: `${DEFAULT_TEMPLATE_CUSTOMIZATION.duration_minutes} min`,
      durationMinutes: DEFAULT_TEMPLATE_CUSTOMIZATION.duration_minutes,
      timezone: DEFAULT_TEMPLATE_CUSTOMIZATION.timezone,
      
      // Design settings - Colors
      pageBackgroundColor: DEFAULT_TEMPLATE_CUSTOMIZATION.page_background_color,
      backgroundColor: DEFAULT_TEMPLATE_CUSTOMIZATION.background_color,
      calendarBackgroundColor: DEFAULT_TEMPLATE_CUSTOMIZATION.calendar_background_color,
      timeSlotButtonColor: DEFAULT_TEMPLATE_CUSTOMIZATION.time_slot_button_color,
      primaryColor: DEFAULT_TEMPLATE_CUSTOMIZATION.primary_color,
      textColor: DEFAULT_TEMPLATE_CUSTOMIZATION.text_color,
      calendarTextColor: DEFAULT_TEMPLATE_CUSTOMIZATION.calendar_text_color,
      
      // Design settings - Typography
      fontFamily: DEFAULT_TEMPLATE_CUSTOMIZATION.font_family,
      fontWeight: DEFAULT_TEMPLATE_CUSTOMIZATION.font_weight,
      
      // Design settings - Border radius
      borderRadius: DEFAULT_TEMPLATE_CUSTOMIZATION.border_radius,
      calendarBorderRadius: DEFAULT_TEMPLATE_CUSTOMIZATION.calendar_border_radius,
      buttonBorderRadius: DEFAULT_TEMPLATE_CUSTOMIZATION.button_border_radius,
      
      // Media settings
      showAvatar: DEFAULT_TEMPLATE_CUSTOMIZATION.show_avatar,
      avatarUrl: '/api/placeholder/60/60',
      showCoverPhoto: DEFAULT_TEMPLATE_CUSTOMIZATION.show_cover_photo,
      coverPhoto: '',
      
      // Custom components
      customTextComponents: DEFAULT_TEMPLATE_CUSTOMIZATION.custom_text_components,
      accordionComponents: DEFAULT_TEMPLATE_CUSTOMIZATION.accordion_components
    };
  }
}