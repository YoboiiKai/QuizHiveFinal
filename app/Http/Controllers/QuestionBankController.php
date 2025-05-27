<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Competition;
use App\Models\Question;

class QuestionBankController extends Controller
{
    public function index()
    {
        // Get competitions with their questions
        $competitions = Competition::where('user_id', auth()->user()->id)
            ->with(['questions' => function($query) {
                $query->select('id', 'competition_id', 'question_text', 'question_type', 'category', 'difficulty', 'points');
            }])
            ->get()
            ->map(function ($competition) {                return [
                    'id' => $competition->id,
                    'competitionName' => $competition->title,
                    'title' => $competition->title, // Added title field for consistency
                    'description' => $competition->description,
                    'categories' => $competition->questions->pluck('category')->unique()->values()->all(),
                    'totalQuestions' => $competition->questions->count(),
                    'questions' => $competition->questions,
                    'created_at' => $competition->created_at,
                    'difficulty' => $competition->difficulty ?? 'medium'
                ];
            });
            
        return Inertia::render('Admin/Question', [
            'competitions' => $competitions,
            'categories' => Question::distinct('category')->pluck('category')
        ]);
    }
}