## Chat 

This package allows you to add a chat system to your Laravel 5 application

## Installation

Add to composer.json and run composer update:

`"musonza/chat": "@dev"`

Add the service provider to your `config\app.php` the providers array

`Musonza\Chat\ChatServiceProvider`

You can use the facade for shorter code. Add this to your aliases:

`'Chat' => Musonza\Chat\Facades\ChatFacade::class` to your `config\app.php`

The class is bound to the ioC as chat

`$chat = App::make('chat');`

Publish the assets:

`php artisan vendor:publish`

This will publish database migrations.

## Usage

The package assumes you have a User model in the App namespace

#### Creating a conversation
`$conversation = Chat::createConversation([$userId, $userId2,...]); //takes an array of user ids`

#### Get a conversation given a conversation_id
`$conversation = Chat::conversation($conversation_id);`

#### Send a message

`Chat::send($conversation->id, 'Hello', $userId); //$userId sending a message to created conversation`

#### Mark message as read

`Chat::messageRead($messageId, $userId); //$userId marks the mesage as read`

#### Mark whole conversation as read

`Chat::conversationRead($conversation->id, $userId);`	

#### Delete a message

`Chat::trash($messageId, $userId);`

#### Clear a conversation

`Chat::clear($conversation->id, $userId);`

#### Get conversation for two users

`Chat::getConversationBetweenUsers($userId, $userId2);`

#### Remove user(s) from conversation

`Chat::removeParticipants($conversation->id, $usersId); //removing one user`

`Chat::removeParticipants($conversation->id, [$usersId, $userId2]); //removing multiple users`

#### Add user(s) to a conversation

`Chat::addParticipants($conversation->id, $userId3); //add one user`

`Chat::addParticipants($conversation->id, [$userId3, $userId4]); //add multiple users`

#### Get messages in a conversation

`Chat::messages($userId, $conversation->id, $perPage, $page);`

#### Get recent messages 

`$mesages = Chat::conversations($userId);`

#### Get users in a conversation

`$users = $conversation->users;`




