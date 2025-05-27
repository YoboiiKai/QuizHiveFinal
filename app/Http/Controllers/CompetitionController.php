<?php

namespace App\Http\Controllers;

use App\Models\Competition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompetitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $competitions = Competition::where('user_id', auth()->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($competition) {
                return [
                    'id' => $competition->id,
                    'title' => $competition->title,
                    'description' => $competition->description,
                    'date' => $competition->date,
                    'location' => $competition->location,
                    'time' => $competition->date ? date('h:i A', strtotime($competition->date)) : null,
                    'teams' => $competition->teams,
                    'rounds' => $competition->rounds,
                    'status' => $competition->status ?? 'Scheduled',
                    'category' => $competition->category ?? 'General',
                ];
            });

        return Inertia::render('Admin/Competition', [
            'competitions' => $competitions
        ]);
    }
    
    /**
     * Get all competitions for the authenticated user (for API use).
     */
    public function getCompetitions()
    {
        $competitions = Competition::where('user_id', auth()->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($competition) {
                return [
                    'id' => $competition->id,
                    'title' => $competition->title,
                    'description' => $competition->description,
                    'date' => $competition->date,
                    'location' => $competition->location,
                    'time' => $competition->date ? date('h:i A', strtotime($competition->date)) : null,
                    'teams' => $competition->teams,
                    'rounds' => $competition->rounds,
                    'status' => $competition->status ?? 'Scheduled',
                    'category' => $competition->category ?? 'General',
                ];
            });

        return response()->json($competitions);
    }

    /**
     * Display the specified resource.
     */
    public function show(Competition $competition)
    {
        // Check if the authenticated user owns this competition
        if ($competition->user_id !== auth()->user()->id) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'You are not authorized to view this competition.'
            ], 403);
        }

        try {
            // Get the competition with any related data you need
            $competition->load('user:id,name');
            
            // Return the competition data
            return response()->json([
                'success' => true,
                'competition' => [
                    'id' => $competition->id,
                    'title' => $competition->title,
                    'description' => $competition->description,
                    'date' => $competition->date,
                    'location' => $competition->location,
                    'teams' => $competition->teams,
                    'rounds' => $competition->rounds,
                    'code' => $competition->code,
                    'created_at' => $competition->created_at,
                    'updated_at' => $competition->updated_at,
                    'user' => $competition->user
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Server Error',
                'message' => 'An error occurred while fetching the competition.'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'teams' => 'nullable|integer|min:0',
            'rounds' => 'nullable|integer|min:0',
            'code' => 'required|string|unique:competitions,code'
        ]);

        $competition = Competition::create([
            ...$validated,
            'user_id' => auth()->user()->id
        ]);
        
        // Refresh the model to get all attributes
        $competition = $competition->fresh();
        
        // Return an Inertia response with the new competition data
        return redirect()->route('admin.competitions')
            ->with('newCompetition', $competition)
            ->with('flash', [
                'type' => 'success',
                'message' => 'Competition created successfully!'
            ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Competition $competition)
    {
        // Check if the authenticated user owns this competition
        if ($competition->user_id !== auth()->user()->id) {
            return redirect()->route('admin.competitions')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'You are not authorized to update this competition.'
                ]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'teams' => 'nullable|integer|min:0',
            'rounds' => 'nullable|integer|min:0',
            'code' => 'required|string|unique:competitions,code,' . $competition->id
        ]);

        $competition->update($validated);
        
        // Refresh the model to get all updated attributes
        $competition = $competition->fresh();

        // Return an Inertia response with the updated competition data
        return redirect()->route('admin.competitions')
            ->with('updatedCompetition', $competition)
            ->with('flash', [
                'type' => 'success',
                'message' => 'Competition updated successfully!'
            ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Competition $competition)
    {
        // Check if the authenticated user owns this competition
        if ($competition->user_id !== auth()->user()->id) {
            return redirect()->route('admin.competitions')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'You are not authorized to delete this competition.'
                ]);
        }

        // Store the ID before deletion
        $deletedId = $competition->id;
        
        $competition->delete();
        
        // Return an Inertia response with the deleted competition ID
        return redirect()->route('admin.competitions')
            ->with('deletedCompetitionId', $deletedId)
            ->with('flash', [
                'type' => 'success',
                'message' => 'Competition deleted successfully!'
            ]);
    }
}
