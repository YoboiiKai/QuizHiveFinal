<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Competition extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'date',
        'location',
        'teams',
        'rounds',
        'code',
        'user_id',
    ];

    /**
     * Get the user that owns the competition.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the questions for this competition.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
