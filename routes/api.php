<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionBankController;
use App\Http\Controllers\QuestionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public route for fetching all question banks (e.g., for dropdowns)
Route::get('/question-banks', [QuestionBankController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Question Bank Routes
    Route::post('/question-banks', [QuestionBankController::class, 'store']);
    Route::get('/question-banks/{questionBank}', [QuestionBankController::class, 'show']);
    Route::put('/question-banks/{questionBank}', [QuestionBankController::class, 'update']);
    Route::delete('/question-banks/{questionBank}', [QuestionBankController::class, 'destroy']);

    // Question Routes
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::put('/questions/{question}', [QuestionController::class, 'update']);
    Route::delete('/questions/{question}', [QuestionController::class, 'destroy']);

    // Bulk update questions in a question bank
    Route::put('/question-banks/{questionBank}/questions', [QuestionController::class, 'bulkUpdate']);
});
