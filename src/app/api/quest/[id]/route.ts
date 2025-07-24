import { NextRequest, NextResponse } from 'next/server';
import { getQuest } from '@/lib/gemini';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questId } = await params;
    
    if (!questId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Quest ID is required' 
        },
        { status: 400 }
      );
    }

    const quest = getQuest(questId);
    
    if (!quest) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Quest not found or has expired' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quest
    });

  } catch (error) {
    console.error('Error fetching quest:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}