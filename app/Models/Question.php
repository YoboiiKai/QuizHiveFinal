<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    protected $fillable = [
        'competition_id',
        'question_text',
        'options',
        'correct_answer',
        'type',
        'category',
        'difficulty',
        'points',
        'time_limit',
        'explanation',
    ];

    protected $casts = [
        'options' => 'array',
        'points' => 'integer',
        'time_limit' => 'integer',
    ];

    /**
     * Get the competition that owns this question.
     */
    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }
}
