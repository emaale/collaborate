<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'projects';

    /**
     * The users that belong to the project.
     */
    public function users()
    {
        return $this->belongsToMany('App\User');
    }

    /**
     * The deadlines that belong to the project.
     */
    public function deadlines()
    {
        return $this->hasMany('App\Deadline');
    }
}
