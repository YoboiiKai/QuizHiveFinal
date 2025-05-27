<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NewQuestionController;
use App\Http\Controllers\CompetitionController;
use App\Http\Controllers\QuestionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    // Competition routes
    Route::get('/competitions', [CompetitionController::class, 'index'])->name('admin.competitions');
    Route::post('/competitions', [CompetitionController::class, 'store'])->name('competitions.store');
    Route::put('/competitions/{competition}', [CompetitionController::class, 'update'])->name('competitions.update');
    Route::delete('/competitions/{competition}', [CompetitionController::class, 'destroy'])->name('competitions.destroy');

    // Question routes
    Route::get('/questions', [NewQuestionController::class, 'index'])->name('admin.questions');
    Route::get('/api/questions', [NewQuestionController::class, 'getQuestions']);
    Route::post('/questions', [NewQuestionController::class, 'store'])->name('questions.store');
    Route::put('/questions/{question}', [NewQuestionController::class, 'update'])->name('questions.update');
    Route::delete('/questions/{question}', [NewQuestionController::class, 'destroy'])->name('questions.destroy');

    // Static page routes
    Route::get('/competition', function () {
        return Inertia::render('Admin/Competition');
    })->name('admin.competition');

    Route::get('/team', function () {
        return Inertia::render('Admin/Team');
    })->name('admin.team');

    Route::get('/theme', function () {
        return Inertia::render('Admin/Theme');
    })->name('admin.theme');
});

require __DIR__.'/auth.php';
