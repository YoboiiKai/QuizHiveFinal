<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Competition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompetitionController extends Controller
{
    public function index()
    {
        $competitions = Competition::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Competition', [
            'competitions' => $competitions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string',
            'teams' => 'required|integer|min:0',
            'rounds' => 'required|integer|min:0',
            'code' => 'required|string|unique:competitions'
        ]);

        $competition = Competition::create($validated);

        return back()->with(['message' => 'Competition created successfully']);
    }

    public function update(Request $request, Competition $competition)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string',
            'teams' => 'required|integer|min:0',
            'rounds' => 'required|integer|min:0',
            'code' => 'required|string|unique:competitions,code,'.$competition->id
        ]);

        $competition->update($validated);

        return back()->with(['message' => 'Competition updated successfully']);
    }

    public function destroy(Competition $competition)
    {
        $competition->delete();
        
        return back()->with(['message' => 'Competition deleted successfully']);
    }
}
