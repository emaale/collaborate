<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Auth;
use App\Http\Requests;
use GuzzleHttp\Client;
use Musonza\Chat\Conversations\Conversation;
use DB;

class ChatController extends Controller
{
    // List all conversations
    public function index(Request $request) {
    	// Get all conversations the user has participated in
        $conversations = DB::table('conversation_user')
            ->join('conversations', 'conversation_user.conversation_id', '=', 'conversations.id')
            ->join('conversation_details', 'conversation_details.conversation_id', '=', 'conversations.id')
            ->where('user_id', '=', Auth::id())
            ->get();

        // Go through conversations and fetch the most recent message
        foreach ($conversations as &$conversation) {
            // Get lastest message not written by the authenticated user
            $message = DB::table('messages')
                ->where('conversation_id', '=', $conversation->id)
                ->where('user_id', '!=', Auth::id())
                ->orderBy('created_at', 'desc')
                ->first();

            // Save it
            $conversation->last_message = $message;

            // Get conversation users
            $chatConversation = \Chat::conversation($conversation->id);

            // Get users in conversation
            $users = $chatConversation->users;

            $conversation->users = $users;

        }

        // Return conversations
        return $conversations;
    }

    // Create a conversation or return an existing one
    public function create(Request $request) {
        // Get users to create conversation between
        $users = $request->json()->get('users');
        $name = $request->json()->get('name');

        // Add the authenticated user to the users as well
        if(!in_array(Auth::id(), $users)) array_push($users, Auth::id());

        // Create conversation
        $id = DB::table('conversations')->insertGetId(['private' => true, 'created_at' => DB::raw('CURRENT_TIMESTAMP'), 'updated_at' => DB::raw('CURRENT_TIMESTAMP')]);

        // Add users to conversation
        foreach ($users as $user) {
            DB::table('conversation_user')->insert(
                ['user_id' => $user, 'conversation_id' => $id, 'created_at' => DB::raw('CURRENT_TIMESTAMP'), 'updated_at' => DB::raw('CURRENT_TIMESTAMP')]
            );
        }

        // Add the name to the conversation
        DB::table('conversation_details')->insert(
            ['name' => $name, 'conversation_id' => $id]
        );

        return $id;
    }

    // Send a message
    public function createMessage(Request $request, $conversation_id) {
        $body = $request->json()->get('message');

        // Create the message
    	\Chat::send($conversation_id, $body, Auth::id());

         // Get messages in conversation
        $messages = DB::table('messages')
            ->where('conversation_id', $conversation_id)
            ->get();

        // Loop through messages and get users
        foreach ($messages as &$message) {
            $message->sender = User::where('id', $message->user_id)->first();
        }

        return $messages;
    }

    // Marks conversation as read
    public function markAsRead(Request $request, $conversation_id) {
    	\Chat::conversationRead($conversation_id, Auth::id());
    }

    // Clears conversation messages
    public function clearMessages(Request $request, $conversation_id) {
        DB::table('messages')->where('conversation_id', $conversation_id)->delete();
    }

    // List conversation with messages
    public function get($conversation_id) {

        // Get conversation
        // $conversation = \Chat::conversation($conversation_id);
        $conversation = DB::table('conversations')
            ->join('conversation_details', 'conversation_details.conversation_id', '=', 'conversations.id')
            ->where('id', $conversation_id)
            ->first();
        
        // Get messages in conversation
    	$messages = DB::table('messages')
            ->where('conversation_id', $conversation_id)
            ->get();

        // Loop through messages and get users
        foreach ($messages as &$message) {
            $message->sender = User::where('id', $message->user_id)->first();
        }

        $conversation->messages = $messages;

        return response()->json($conversation);
    }

    // Remove user from conversation
    public function removeUsers(Request $request, $conversation_id) {
        // Get users
        $users = $request->json()->get('users');

    	\Chat::removeParticipants($conversation_id, $users); // Remove multiple users or one
    }

    // Add user or users to the conversation
    public function addUsers(Request $request, $conversation_id) {
        // Get users
        $users = $request->json()->get('users');

        // Get conversation
        $conversation = \Chat::conversation($conversation_id);

        // Get users in conversation
        $previous_users = $conversation->users;

        // Extract only ids
        foreach ($previous_users as $user) {
            array_push($users, $user->id);
        }

    	\Chat::addParticipants($conversation_id, $users); // Add multiple users or one
    }

    public function listUsersByConversation(Request $request, $id) {
        // Get conversation
        $conversation = \Chat::conversation($id);

        // Get users in conversation
        $users = $conversation->users;

        return $users;
    }
}
