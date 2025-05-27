<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competition_id')->constrained('competitions')->onDelete('cascade');
            $table->text('question_text');
            $table->json('options')->nullable(); // For multiple choice questions
            $table->string('correct_answer');
            $table->enum('type', ['multiple_choice', 'true_false', 'open_ended']);
            $table->string('category');
            $table->string('difficulty');
            $table->integer('points')->default(1);
            $table->integer('time_limit')->nullable(); // Time limit in seconds
            $table->text('explanation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
