<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class QuestionController extends Controller 
{
    private $defaultCategories = ['Science', 'Math', 'History', 'Literature'];
    private $defaultDifficulties = ['easy', 'medium', 'hard'];
    private $defaultQuestionTypes = ['multiple_choice', 'true_false', 'open_ended'];

    public function index(Request $request) 
    {
        $query = Question::with('competition');
        
        if ($request->has('competition_id')) {
            $query->where('competition_id', $request->query('competition_id'));
        }
        
        $questions = $query->latest()->paginate(10);
        $formattedQuestions = $questions->map(function ($question) {
            return [
                'id' => $question->id,
                'questionText' => $question->question_text,
                'questionType' => str_replace('_', '-', $question->type),
                'options' => $question->options,
                'correctAnswer' => $question->correct_answer,
                'category' => $question->category,
                'difficulty' => $question->difficulty,
                'points' => $question->points,
                'timeLimit' => $question->time_limit,
                'explanation' => $question->explanation ?? '',
                'competitionId' => $question->competition_id,
                'competitionName' => $question->competition ? $question->competition->title : null,
                'createdAt' => $question->created_at,
                'updatedAt' => $question->updated_at
            ];
        });

        return Inertia::render('Admin/Question', [
            'questions' => $formattedQuestions,
            'categories' => $this->defaultCategories,
            'difficulties' => $this->defaultDifficulties,
            'questionTypes' => $this->defaultQuestionTypes,
            'pagination' => [
                'current_page' => $questions->currentPage(),
                'last_page' => $questions->lastPage(),
                'per_page' => $questions->perPage(),
                'total' => $questions->total()
            ]
        ]);
    }

    public function create() 
    {
        return Inertia::render('Admin/Question', [
            'mode' => 'create',
            'categories' => $this->defaultCategories,
            'difficulties' => $this->defaultDifficulties,
            'questionTypes' => $this->defaultQuestionTypes
        ]);
    }

    public function store(Request $request) 
    {
        $data = $request->all();
        if (isset($data['question_type'])) {
            $data['type'] = str_replace('-', '_', $data['question_type']);
        }
        
        if (empty($data['correct_answer']) && !empty($data['correctAnswer'])) {
            $data['correct_answer'] = $data['correctAnswer'];
        }

        $validator = Validator::make($data, [
            'competition_id' => 'required|exists:competitions,id',
            'question_text' => 'required|string|max:1000',
            'options' => 'required_if:type,multiple_choice|array',
            'correct_answer' => 'required|string',
            'type' => 'required|in:multiple_choice,true_false,open_ended',
            'category' => 'required|string',
            'difficulty' => 'required|string',
            'points' => 'integer|min:1',
            'time_limit' => 'nullable|integer|min:1',
            'explanation' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $validatedData = $validator->validated();
            Question::create([
                'competition_id' => $validatedData['competition_id'],
                'question_text' => $validatedData['question_text'],
                'options' => $data['options'] ?? [],
                'correct_answer' => $validatedData['correct_answer'],
                'type' => $validatedData['type'],
                'category' => $validatedData['category'],
                'difficulty' => $validatedData['difficulty'],
                'points' => $validatedData['points'] ?? 1,
                'time_limit' => $validatedData['time_limit'] ?? null,
                'explanation' => $data['explanation'] ?? null
            ]);

            return redirect()->route('admin.questions')->with('success', 'Question created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create question: ' . $e->getMessage()]);
        }
    }

    public function edit(Question $question) 
    {
        return Inertia::render('Admin/Question', [
            'mode' => 'edit',
            'question' => [
                'id' => $question->id,
                'questionText' => $question->question_text,
                'questionType' => str_replace('_', '-', $question->type),
                'options' => $question->options,
                'correctAnswer' => $question->correct_answer,
                'category' => $question->category,
                'difficulty' => $question->difficulty,
                'points' => $question->points,
                'timeLimit' => $question->time_limit,
                'explanation' => $question->explanation ?? '',
                'competitionId' => $question->competition_id,
                'createdAt' => $question->created_at,
                'updatedAt' => $question->updated_at
            ],
            'categories' => $this->defaultCategories,
            'difficulties' => $this->defaultDifficulties,
            'questionTypes' => $this->defaultQuestionTypes
        ]);
    }

    public function update(Request $request, Question $question) 
    {
        $data = $request->all();
        if (isset($data['question_type'])) {
            $data['type'] = str_replace('-', '_', $data['question_type']);
        }

        if (empty($data['correct_answer']) && !empty($data['correctAnswer'])) {
            $data['correct_answer'] = $data['correctAnswer'];
        }

        $validator = Validator::make($data, [
            'question_text' => 'required|string|max:1000',
            'options' => 'required_if:type,multiple_choice|array',
            'correct_answer' => 'required|string',
            'type' => 'required|in:multiple_choice,true_false,open_ended',
            'category' => 'required|string',
            'difficulty' => 'required|string',
            'points' => 'required|integer|min:1',
            'time_limit' => 'nullable|integer|min:1',
            'explanation' => 'nullable|string',
            'competition_id' => 'exists:competitions,id'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $validatedData = $validator->validated();
            
            $question->update([
                'question_text' => $validatedData['question_text'],
                'options' => $data['options'] ?? $question->options,
                'correct_answer' => $validatedData['correct_answer'],
                'type' => $validatedData['type'],
                'category' => $validatedData['category'],
                'difficulty' => $validatedData['difficulty'],
                'points' => $validatedData['points'],
                'time_limit' => $validatedData['time_limit'] ?? null,
                'explanation' => $validatedData['explanation'] ?? null,
                'competition_id' => $validatedData['competition_id'] ?? $question->competition_id
            ]);

            return redirect()->route('admin.questions')->with('success', 'Question updated successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update question: ' . $e->getMessage()]);
        }
    }

    public function destroy(Question $question) 
    {
        try {
            $question->delete();
            return redirect()->route('admin.questions')->with('success', 'Question deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete question: ' . $e->getMessage()]);
        }
    }
}
