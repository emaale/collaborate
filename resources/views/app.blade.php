<!DOCTYPE html>
<html>
<head>
	<title>Collaborate</title>

	<!-- Meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<!-- CSS -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/css/bootstrap-select.min.css">
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.3/jquery.mCustomScrollbar.min.css">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="css/bootstrap-material-datetimepicker.css">
	<link rel="stylesheet" type="text/css" href="css/app.css">

	<!-- AngularJS and dependencies -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/js/bootstrap-select.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.10/angular.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.3/jquery.mCustomScrollbar.min.js"></script>
	<script src="javascript/vendor/scrollbars.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"></script>
	<script src="javascript/vendor/bootstrap-material-datetimepicker.js"></script>
	<script src="http://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.10/angular-ui-router.js"></script>
	<script src="//cdn.jsdelivr.net/satellizer/0.12.5/satellizer.min.js"></script>

	<!-- Collaborate Application -->
	<script type="text/javascript" src="javascript/collaborate.js"></script>

	<!-- Services -->
	<script type="text/javascript" src="javascript/services/UserService.js"></script>
	<script type="text/javascript" src="javascript/services/TeamService.js"></script>
	<script type="text/javascript" src="javascript/services/ChatService.js"></script>
	<script type="text/javascript" src="javascript/services/ProjectService.js"></script>
	<script type="text/javascript" src="javascript/services/DeadlineService.js"></script>

	<!-- Controllers -->
	<script type="text/javascript" src="javascript/controllers/AuthCtrl.js"></script>
	<script type="text/javascript" src="javascript/controllers/NavCtrl.js"></script>
	<script type="text/javascript" src="javascript/controllers/UserCtrl.js"></script>
	<script type="text/javascript" src="javascript/controllers/TeamCtrl.js"></script>
	<script type="text/javascript" src="javascript/controllers/ProjectCtrl.js"></script>
	<script type="text/javascript" src="javascript/controllers/DeadlineCtrl.js"></script>
	<script type="text/javascript" src="javascript/controllers/ChatCtrl.js"></script>

</head>
<body data-ng-app="collaborateApp">

	<!-- Header containing navigation -->
	<header ui-view="header"></header>

	<!-- AngularJS View and Page Wrapper -->
	<div ui-view="page" class="page-wrapper row">
		
	</div>

</body>
</html>
