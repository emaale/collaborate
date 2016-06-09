<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Deadline extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'deadlines';

    /**
     * The project that belong to the deadline.
     */
    public function project()
    {
        return $this->belongsTo('App\Project');
    }
}
