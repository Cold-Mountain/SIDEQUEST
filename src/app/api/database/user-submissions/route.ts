import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, blockType, actionIdea, whyMeaningful } = body;
    
    // Validate required fields
    if (!blockType || !actionIdea || !whyMeaningful) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: blockType, actionIdea, whyMeaningful' 
        },
        { status: 400 }
      );
    }
    
    const success = await database.submitUserSuggestion({
      User_Email: userEmail || '',
      Block_Type: blockType,
      Action_Idea: actionIdea,
      Why_Meaningful: whyMeaningful,
    });
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'User suggestion submitted successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to submit user suggestion' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error submitting user suggestion:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit user suggestion',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}