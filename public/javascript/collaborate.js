var app = angular.module('collaborateApp', ['ui.router', 'satellizer', 'ngScrollbars']);

app.run(function ($rootScope, $state, $auth) {

    // Monitor state changes
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        
        // Check if authentication is required by the route, and if the visitor is not logged in
        if (toState.authenticate && !$auth.isAuthenticated()){

            // User isn’t authenticated - prevent the requested route from firing, and redirect to login
            $state.transitionTo("login");
            event.preventDefault(); 

        } else if(toState.name == "login" && $auth.isAuthenticated()) { // Check if visitor is authenticated and requesting the login state
            
            // User is authenticated - prevent the requested route from firing and redirect to the application root route
            $state.transitionTo("user");
            event.preventDefault();

        }

    });

});

app.config(['$stateProvider','$urlRouterProvider', '$authProvider', 'ScrollBarsProvider', function($stateProvider, $urlRouterProvider, $authProvider, ScrollBarsProvider) {

    // Set up scrollbars
    ScrollBarsProvider.defaults = {
        theme: 'minimal-dark',
        autoHideScrollbar: false,
        advanced:{
            updateOnContentResize: true
        },
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed
            enable: true // enable scrolling buttons by default
        },
        scrollInertia: 400,
        setHeight: 300,
        axis: 'y' // enable 2 axis scrollbars by default
    };

    // Set up authentication 
    $authProvider.github({
        clientId: 'aafa8cff268722e43d3d',
        url: '/auth/github',
        redirectUri: window.location.origin,
        optionalUrlParams: ['scope'],
        scope: ['user repo read:org write:org admin:org'],
        scopeDelimiter: ' ',
    });

    // Set up routes
    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'page': {
                    templateUrl: 'partials/login.html',
                    controller: 'AuthCtrl',
                }
            },
            authenticate: false
        })
        .state('user', {
            url: '/user',
            views: {
                'page': {
                    templateUrl: 'partials/user.html',
                    controller: 'UserCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            authenticate: true
        })
        .state('userLookup', {
            url: '/users/:userId',
            views: {
                'page': {
                    templateUrl: 'partials/user-lookup.html',
                    controller: 'UserCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            authenticate: true
        })
        .state('teams', {
            url: '/teams',
            views: {
                'page': {
                    templateUrl: 'partials/teams.html',
                    controller: 'TeamCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                teamData: function(TeamService) {
                    TeamService.getOrgsWithTeams();
                    return TeamService.organizations;
                }
            },
            authenticate: true
        })
        .state('createTeam', {
            url: '/teams/new',
            views: {
                'page': {
                    templateUrl: 'partials/team-create.html',
                    controller: 'TeamCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                teamData: function(TeamService) {
                    TeamService.getOrgsWithTeams();
                    return TeamService.organizations;
                }
            },
            authenticate: true
        })
        .state('team', {
            url: '/teams/:teamId',
            views: {
                'page': {
                    templateUrl: 'partials/team.html',
                    controller: 'TeamCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                teamData: function(TeamService, $stateParams) {
                    TeamService.getTeam($stateParams.teamId).then(function(res) {
                        console.log(res);
                    });
                    return TeamService.team;
                }
            },
            authenticate: true
        })
        .state('teamMember', {
            url: '/teams/:team/members/:user',
            views: {
                'page': {
                    templateUrl: 'partials/teamMember.html',
                    controller: 'TeamCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                teamData: function(TeamService, $stateParams) {
                    TeamService.getTeamMember($stateParams.team, $stateParams.user);
                    return TeamService.teamMember;
                }
            },
            authenticate: true
        })
        .state('projects', {
            url: '/projects',
            views: {
                'page': {
                    templateUrl: 'partials/projects.html',
                    controller: 'ProjectCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                projectData: function(ProjectService) {
                    ProjectService.all();
                    
                    return ProjectService.projects;
                },
                project: function(ProjectService, $stateParams) {
                    return "";
                },
            },
            authenticate: true
        })
        .state('createProject', {
            url: '/projects/new',
            views: {
                'page': {
                    templateUrl: 'partials/project-create.html',
                    controller: 'ProjectCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                projectData: function(ProjectService) {
                    return ProjectService.projects;
                },
                project: function(ProjectService, $stateParams) {
                    return "";
                },
            },
            authenticate: true
        })
        .state('project', {
            url: '/projects/:projectId',
            views: {
                'page': {
                    templateUrl: 'partials/project.html',
                    controller: 'ProjectCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                projectData: function(ProjectService, $stateParams) {
                    ProjectService.getDocumentation($stateParams.projectId);

                    return ProjectService.documentation;
                },
                project: function(ProjectService, $stateParams) {
                    ProjectService.get($stateParams.projectId);

                    return ProjectService.project;
                },
            },
            authenticate: true
        })
        .state('projectCommits', {
            url: '/projects/:projectId/commits',
            views: {
                'page': {
                    templateUrl: 'partials/project-commits.html',
                    controller: 'ProjectCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                projectData: function(ProjectService, $stateParams) {
                    ProjectService.getCommits($stateParams.projectId);

                    return ProjectService.commits;
                },
                project: function(ProjectService, $stateParams) {
                    ProjectService.get($stateParams.projectId);

                    return ProjectService.project;
                },
            },
            authenticate: true
        })
        .state('projectCollaborators', {
            url: '/projects/:projectId/collaborators',
            views: {
                'page': {
                    templateUrl: 'partials/project-collaborators.html',
                    controller: 'ProjectCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                projectData: function(ProjectService, $stateParams) {
                    ProjectService.getCollaborators($stateParams.projectId).then(function(res) {
                        console.log(res.data);
                    });

                    return ProjectService.collaborators;
                },
                project: function(ProjectService, $stateParams) {
                    ProjectService.get($stateParams.projectId);

                    return ProjectService.project;
                },
            },
            authenticate: true
        })
        .state('projectDeployment', {
            url: '/projects/:projectId/deploy',
            views: {
                'page': {
                    templateUrl: 'partials/project-deployment.html',
                    controller: 'ProjectCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                projectData: function(ProjectService) {
                    return "";
                },
                project: function(ProjectService, $stateParams) {
                    ProjectService.get($stateParams.projectId);

                    return ProjectService.project;
                },
            },
            authenticate: true
        })
        .state('deadlines', {
            url: '/deadlines',
            views: {
                'page': {
                    templateUrl: 'partials/deadlines.html',
                    controller: 'DeadlineCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                deadlineData: function(DeadlineService) {
                    DeadlineService.all();

                    return DeadlineService.deadlines;
                },
            },
            authenticate: true
        })
        .state('createDeadline', {
            url: '/deadlines/new',
            views: {
                'page': {
                    templateUrl: 'partials/deadline-create.html',
                    controller: 'DeadlineCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                deadlineData: function(DeadlineService) {
                    return DeadlineService.projects;
                },
            },
            authenticate: true
        })
        .state('deadline', {
            url: '/deadlines/:deadlineId',
            views: {
                'page': {
                    templateUrl: 'partials/deadline.html',
                    controller: 'DeadlineCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                deadlineData: function(DeadlineService, $stateParams) {
                    DeadlineService.get($stateParams.deadlineId).then(function(res) {
                        console.log(res);
                    });

                    return DeadlineService.deadline;
                },
            },
            authenticate: true
        })
        .state('chat', {
            url: '/chat',
            views: {
                'page': {
                    templateUrl: 'partials/chat/chat.html',
                    controller: 'ChatCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                conversations: function(ChatService) {
                    // return "dfsd";
                    ChatService.getConversations();
                    
                    return ChatService.conversations;
                },
                chatData: function() {
                    return "";
                }
            },
            authenticate: true
        })
        .state('createConversation', {
            url: '/chat/conversations/new',
            views: {
                'page': {
                    templateUrl: 'partials/chat/conversation-create.html',
                    controller: 'ChatCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                conversations: function(ChatService) {
                    // return "dfsd";
                    ChatService.getConversations();
                    
                    return ChatService.conversations;
                },
                chatData: function() {
                    return "";
                }
            },
            authenticate: true
        })
        .state('conversation', {
            url: '/chat/conversations/:conversationId',
            views: {
                'page': {
                    templateUrl: 'partials/chat/conversation.html',
                    controller: 'ChatCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                conversations: function(ChatService, $stateParams) {
                    ChatService.getConversations();
                    
                    return ChatService.conversations;
                },
                chatData: function(ChatService, $stateParams) {
                    ChatService.getConversationWithMessages($stateParams.conversationId);

                    return ChatService.conversation;
                }
            },
            authenticate: true
        })
        .state('conversationParticipants', {
            url: '/chat/conversations/:conversationId/participants',
            views: {
                'page': {
                    templateUrl: 'partials/chat/conversation-participants.html',
                    controller: 'ChatCtrl',
                },
                'header': {
                    templateUrl: 'partials/header.html',
                    controller: 'NavCtrl',
                }
            },
            resolve: {
                conversations: function(ChatService, $stateParams) {
                    ChatService.getConversations();
                    
                    return ChatService.conversations;
                },
                chatData: function(ChatService, $stateParams) {
                    ChatService.getConversationUsers($stateParams.conversationId);
                    ChatService.searchCollaborateUsers();

                    return ChatService.conversationUsers;
                }
            },
            authenticate: true
        });

    // 404 Redirect
    $urlRouterProvider.otherwise('/user');
}]);

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                    scope.$apply(function(){
                            scope.$eval(attrs.ngEnter);
                    });
                    
                    event.preventDefault();
            }
        });
    };
});