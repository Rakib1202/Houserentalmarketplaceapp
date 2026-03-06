import { supabase, handleSupabaseError } from '../lib/supabase';

// ==============================================
// CMS CONTENT SERVICE
// ==============================================
export const cmsContentService = {
  // Get all content
  async getAll(filters?: { type?: string; status?: string }) {
    try {
      let query = supabase
        .from('cms_content')
        .select('*, author:users!author_id(full_name)');

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Get content by slug
  async getBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*, author:users!author_id(full_name)')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from('cms_content')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id);

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Create content
  async create(contentData: any) {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .insert(contentData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Update content
  async update(id: string, contentData: any) {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .update(contentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Delete content
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('cms_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Publish content
  async publish(id: string) {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .update({ status: 'published' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },
};

// ==============================================
// SEO SETTINGS SERVICE
// ==============================================
export const seoService = {
  // Get all SEO settings
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_name');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Get SEO settings by URL
  async getByUrl(url: string) {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('url', url)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Create SEO settings
  async create(seoData: any) {
    try {
      // Calculate SEO score
      const score = this.calculateSEOScore(seoData);

      const { data, error } = await supabase
        .from('seo_settings')
        .insert({ ...seoData, seo_score: score })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Update SEO settings
  async update(id: string, seoData: any) {
    try {
      // Calculate SEO score
      const score = this.calculateSEOScore(seoData);

      const { data, error } = await supabase
        .from('seo_settings')
        .update({ ...seoData, seo_score: score })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Calculate SEO score
  calculateSEOScore(seoData: any): number {
    let score = 0;

    // Title (30 points)
    if (seoData.title) {
      const titleLength = seoData.title.length;
      if (titleLength >= 50 && titleLength <= 60) {
        score += 30;
      } else if (titleLength >= 40 && titleLength <= 70) {
        score += 20;
      } else if (titleLength > 0) {
        score += 10;
      }
    }

    // Meta Description (30 points)
    if (seoData.meta_description) {
      const descLength = seoData.meta_description.length;
      if (descLength >= 150 && descLength <= 160) {
        score += 30;
      } else if (descLength >= 120 && descLength <= 180) {
        score += 20;
      } else if (descLength > 0) {
        score += 10;
      }
    }

    // Focus Keyword (20 points)
    if (seoData.focus_keyword) {
      score += 20;
      // Bonus if focus keyword is in title
      if (seoData.title && seoData.title.toLowerCase().includes(seoData.focus_keyword.toLowerCase())) {
        score += 5;
      }
    }

    // Keywords array (10 points)
    if (seoData.keywords && seoData.keywords.length > 0) {
      score += 10;
    }

    // OG Image (5 points)
    if (seoData.og_image) {
      score += 5;
    }

    return Math.min(score, 100);
  },
};

// ==============================================
// MEDIA LIBRARY SERVICE
// ==============================================
export const mediaService = {
  // Get all media files
  async getAll(filters?: { fileType?: string; folder?: string }) {
    try {
      let query = supabase
        .from('media_files')
        .select('*, uploader:users!uploaded_by(full_name)');

      if (filters?.fileType) {
        query = query.eq('file_type', filters.fileType);
      }
      if (filters?.folder) {
        query = query.eq('folder', filters.folder);
      }

      const { data, error } = await query.order('uploaded_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Upload media file
  async upload(file: File, folder: string, uploadedBy: string) {
    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Get file dimensions if image
      let dimensions: string | undefined;
      if (file.type.startsWith('image/')) {
        dimensions = await this.getImageDimensions(file);
      }

      // Save metadata to database
      const { data, error } = await supabase
        .from('media_files')
        .insert({
          name: file.name,
          file_url: publicUrl,
          file_type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
          file_size: file.size,
          folder,
          dimensions,
          uploaded_by: uploadedBy,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Delete media file
  async delete(id: string) {
    try {
      // Get file info
      const { data: file } = await supabase
        .from('media_files')
        .select('file_url')
        .eq('id', id)
        .single();

      if (file) {
        // Extract file path from URL
        const urlParts = file.file_url.split('/media/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];

          // Delete from storage
          await supabase.storage
            .from('media')
            .remove([filePath]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('media_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Get image dimensions
  async getImageDimensions(file: File): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(`${img.width}x${img.height}`);
      };
      img.onerror = () => {
        resolve('');
      };
      img.src = URL.createObjectURL(file);
    });
  },

  // Get folders
  async getFolders() {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('folder')
        .not('folder', 'is', null);

      if (error) throw error;

      const folders = Array.from(new Set(data.map(item => item.folder)));
      return { success: true, data: folders };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },
};

// ==============================================
// ANALYTICS SERVICE
// ==============================================
export const analyticsService = {
  // Track page view
  async trackPageView(pageUrl: string) {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get or create today's analytics
      const { data: existing } = await supabase
        .from('page_analytics')
        .select('*')
        .eq('page_url', pageUrl)
        .eq('date', today)
        .single();

      if (existing) {
        // Update existing
        await supabase
          .from('page_analytics')
          .update({
            views: existing.views + 1,
            unique_visitors: existing.unique_visitors + 1, // Should track by session
          })
          .eq('id', existing.id);
      } else {
        // Create new
        await supabase
          .from('page_analytics')
          .insert({
            page_url: pageUrl,
            views: 1,
            unique_visitors: 1,
            avg_time_seconds: 0,
            bounce_rate: 0,
            date: today,
          });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Get analytics by date range
  async getByDateRange(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('page_analytics')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },

  // Get aggregated stats
  async getAggregatedStats(days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('page_analytics')
        .select('*')
        .gte('date', startDateStr);

      if (error) throw error;

      // Aggregate by page URL
      const pageStats = new Map();

      data.forEach(record => {
        if (!pageStats.has(record.page_url)) {
          pageStats.set(record.page_url, {
            pageUrl: record.page_url,
            totalViews: 0,
            totalUniqueVisitors: 0,
            avgTime: 0,
            avgBounceRate: 0,
            recordCount: 0,
          });
        }

        const stats = pageStats.get(record.page_url);
        stats.totalViews += record.views;
        stats.totalUniqueVisitors += record.unique_visitors;
        stats.avgTime += record.avg_time_seconds;
        stats.avgBounceRate += record.bounce_rate;
        stats.recordCount += 1;
      });

      // Calculate averages
      const result = Array.from(pageStats.values()).map(stats => ({
        pageUrl: stats.pageUrl,
        totalViews: stats.totalViews,
        totalUniqueVisitors: stats.totalUniqueVisitors,
        avgTimeSeconds: Math.round(stats.avgTime / stats.recordCount),
        avgBounceRate: (stats.avgBounceRate / stats.recordCount).toFixed(2),
      }));

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  },
};

// Export all CMS services
export default {
  content: cmsContentService,
  seo: seoService,
  media: mediaService,
  analytics: analyticsService,
};
