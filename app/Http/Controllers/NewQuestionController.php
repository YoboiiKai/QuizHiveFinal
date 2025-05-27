<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Competition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class NewQuestionController extends Controller
{
    public function index(Request $request)
    {
        // Get all competitions for the filter dropdown
        $competitions = Competition::select('id', 'title')->get();
        
        return Inertia::render('Admin/Question', [
            'competitions' => $competitions,
            'categories' => ['Science', 'Math', 'History', 'Literature'],
            'difficulties' => ['easy', 'medium', 'hard'],
            'questionTypes' => ['multiple_choice', 'true_false', 'open_ended']
        ]);
    }

    public function getQuestions(Request $request)
    {
        $query = Question::with('competition');
        
        if ($request->has('competition_id') && !empty($request->competition_id)) {
            $query->where('competition_id', $request->competition_id);
        }
        
        $questions = $query->latest()->paginate(10);
        
        $formattedQuestions = $questions->map(function ($question) {
            // Format options to ensure they're always in a consistent format
            $options = $question->options;
            if (is_array($options)) {
                $formattedOptions = [];
                foreach ($options as $key => $option) {
                    if (is_array($option) || is_object($option)) {
                        // If option is already an array or object, convert to string
                        if (isset($option['text'])) {
                            $formattedOptions[] = $option['text'];
                        } elseif (is_string($option) || is_numeric($option)) {
                            $formattedOptions[] = $option;
                        }
                    } else {
                        // Simple string option
                        $formattedOptions[] = $option;
                    }
                }
                $options = $formattedOptions;
            }
            
            return [
                'id' => $question->id,
                'questionText' => $question->question_text,
                'questionType' => str_replace('_', '-', $question->type),
                'options' => $options,
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

        return response()->json([
            'questions' => $formattedQuestions,
            'pagination' => [
                'current_page' => $questions->currentPage(),
                'last_page' => $questions->lastPage(),
                'per_page' => $questions->perPage(),
                'total' => $questions->total()
            ]
        ]);
    }

    /**
     * Store a newly created question in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
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
            'points' => 'nullable|integer|min:1',
            'time_limit' => 'nullable|integer|min:1',
            'explanation' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
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
            return redirect()->back()->withErrors(['error' => 'Failed to create question: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified question in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\RedirectResponse
     */
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
            return redirect()->back()->withErrors($validator)->withInput();
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
            return redirect()->back()->withErrors(['error' => 'Failed to update question: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified question from the database.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function destroy(Question $question)
    {
        try {
            $question->delete();
            
            // Check if it's an AJAX request
            if (request()->wantsJson()) {
                return response()->json(['success' => true, 'message' => 'Question deleted successfully']);
            }
            
            return redirect()->route('admin.questions')->with('success', 'Question deleted successfully');
        } catch (\Exception $e) {
            if (request()->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Failed to delete question: ' . $e->getMessage()], 500);
            }
            
            return redirect()->back()->withErrors(['error' => 'Failed to delete question: ' . $e->getMessage()]);
        }
    }
}
