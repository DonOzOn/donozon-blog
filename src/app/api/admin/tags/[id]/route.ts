import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { tagRepository } from '@/repositories/tag.repository';
import type { TagInsert } from '@/types/database';

// GET /api/admin/tags/[id] - Get single tag
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Try to get by ID first, if not found, try by slug
    let tag;
    try {
      const { data, error } = await supabaseAdmin
        .from('tags')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      tag = data;
    } catch {
      // If ID lookup fails, try slug lookup
      tag = await tagRepository.getTagBySlug(id);
    }

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tags/[id] - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates: Partial<TagInsert> = await request.json();

    const updatedTag = await tagRepository.updateTag(id, updates);
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tags/[id] - Delete tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    // First, check if the tag exists
    const { data: existingTag, error: checkError } = await supabaseAdmin
      .from('tags')
      .select('id, name')
      .eq('id', id)
      .single();

    if (checkError || !existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    console.log(`🗑️ Deleting tag: ${existingTag.name} (${id})`);

    // Remove all article-tag associations first (using admin client for permissions)
    const { error: articleTagsError } = await supabaseAdmin
      .from('article_tags')
      .delete()
      .eq('tag_id', id);

    if (articleTagsError) {
      console.error('Error deleting article_tags associations:', articleTagsError);
      return NextResponse.json(
        { error: `Failed to remove tag associations: ${articleTagsError.message}` },
        { status: 500 }
      );
    }

    console.log(`✅ Removed article-tag associations for tag: ${id}`);

    // Then delete the tag itself
    const { error: tagError } = await supabaseAdmin
      .from('tags')
      .delete()
      .eq('id', id);

    if (tagError) {
      console.error('Error deleting tag:', tagError);
      return NextResponse.json(
        { error: `Failed to delete tag: ${tagError.message}` },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully deleted tag: ${existingTag.name}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Tag "${existingTag.name}" deleted successfully` 
    });
  } catch (error: any) {
    console.error('Unexpected error deleting tag:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
