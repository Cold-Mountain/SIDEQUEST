import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    const questBlocks = await database.getQuestBlocks(forceRefresh);
    
    return NextResponse.json({
      success: true,
      data: questBlocks,
      count: questBlocks.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching quest blocks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch quest blocks',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST method to filter quest blocks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { criteria } = body;
    
    const questBlocks = await database.getQuestBlocks();
    const filteredBlocks = database.filterQuestBlocks(questBlocks, criteria);
    
    return NextResponse.json({
      success: true,
      data: filteredBlocks,
      count: filteredBlocks.length,
      originalCount: questBlocks.length,
      criteria,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error filtering quest blocks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to filter quest blocks',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}