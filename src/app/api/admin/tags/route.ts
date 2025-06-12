import { NextRequest, NextResponse } from 'next/server';
import { tagRepository } from '@/repositories/tag.repository';
import type { TagInsert } from '@/types/database';

// GET /api/admin/tags - Get all tags
export async function GET() {
  try {
    const tags = await tagRepository.getTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST /api/admin/tags - Create new tag
export async function POST(request: NextRequest) {
  try {
    const tagData: TagInsert = await request.json();
    
    // Validate required fields
    if (!tagData.name || !tagData.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const newTag = await tagRepository.createTag(tagData);
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
