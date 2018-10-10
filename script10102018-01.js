<!DOCTYPE html>
<html ng-app="app">
  <head>  	 		
	<title>PDU - Remote HMI App</title>
	
	<!-- Meta Tag for the screen to be responsive -->
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
	<link rel="stylesheet" href="css/font-awesome.min.css">	
	<link rel="stylesheet" href="dist/abb-components/fonts/fontello-pcs200/css/fontello.css">
	<link rel="stylesheet" href="dist/abb-components/css/abb-components-pec200.css">
    <link rel="stylesheet" href="dist/bootstrap/bootstrap.min.css">				
	<link rel="stylesheet" href="dist/angular/xeditable.css">
	<link rel="stylesheet" href="dist/bootstrap/bootstrap-switch.css">
	<link rel="stylesheet" href="dist/angular/angular-range-slider.css">
	<link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/ms-home-style.css">
	<script src="dist/jquery/jquery.min.js"></script>
	<script src="dist/bootstrap/bootstrap-switch.js"></script>
	<script src="dist/angular/angular.js"></script>
    <script src="dist/angular/angular-route.js"></script>   	
	<script src="dist/angular/angular-range-slider.js"></script>
    <script src="dist/bootstrap/bootstrap.min.js"></script>		
	<script src="dist/charts/Chart.min.js"></script>	
	<script src="dist/charts/angular-chart.min.js"></script>
	<script src="dist/angular/xeditable.js"></script>			
	<script src="dist/angular/angular-animate.js"></script>
	<script src="dist/angular/angular-sanitize.js"></script>
	<script src="dist/angular/angular-cookie.js"></script>
	<script src="js/constants.js"></script>		
	<script src="js/script.js"></script>	
	<script src="js/filters/filter.js"></script>	
  </head>
  
  <body>
    <div class="main_container" ng-init="isVisible=true" ng-controller="MainController">				
		<div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 main-menu-layout">			
			<ul class="nav nav-tabs nav-stacked main-menu" active-link>				
				<li class="icon-container">
					<img style="visibility: hidden" ng-if="routeFlow.home=='home'" class="logo" src="./images/{{logo}}.png" />
					<!--<i ng-if="routeFlow.home!='home'" class="fa fa-arrow-circle-o-left graph-table-glyphicon" style="margin-left: 10px;padding: 0px 2px;color: white;" aria-hidden="true" ng-click="routeMetersHomePage();"></i>-->
				</li>	
				<!--<li class="icon-container active-link"><a ng-click="clickHome()" ng-href="{{isDisabled ? '' : '#/home'}}" ng-class="{disabled: isDisabled}"><img src="./images/icons/nav/UI_Home_24.png"/></a></li>-->
				<li class="icon-container active-link"><a ng-click="clickHome()" ng-class="{disabled: !isClickable}"><img src="./images/icons/nav/UI_Home_24.png"/></a></li>
				<li class="icon-container">					
					<a href="#/event">
						<label id="active-event-counter-id" class="event-notify-hide event-notify">{{eventCounter}}</label>
						<img src="./images/icons/nav/UI_Eventlog_24.png" />
					</a>
				</li>
				<!--<li class="icon-container"><a href="#/{{routeFlow.meters}}"><img src="./images/icons/nav/UI_Meters_24.png" /></a></li>-->
                <li class="icon-container"><a href="#/metershome"><img src="./images/icons/nav/UI_Meters_24.png"/></a></li>
                <!--<li class="icon-container"><a href="#/metersbranch"><img src="./images/icons/UI_Link_24.png"/></a></li>-->
				<li class="icon-container"><a href="#/pdumeteringsettings"><img src="./images/icons/nav/UI_Settings_24.png"/></a></li>
				<li class="icon-container"><a href="#/service"><img src="./images/icons/nav/UI_Service_24.png" /></a></li>									
				<li class="icon-container"><a href="#/about"><img src="./images/icons//nav/UI_About_24.png"/></a></li>
				<li class="icon-container"><a href="#/help"><img src="./images/icons/nav/UI_Help_24.png"/></a></li>
				<li class="icon-container" style="margin-top: 100px;">
					<a href="#/login"><img src="./images/icons/nav/UI_UserInCircle_24.png" />
					<div style="margin-left: -5px;">{{loggedInUserName}}</div></a>
				</li>	
			</ul>
		</div>
		
		<div class="content-class col-xs-11" style="background-color: {{bgTheme}}">
		
			<div id="content-view-id" class="clearfix" style="width: calc(100vw - 315px); float: left;">
				<ng-view></ng-view>	
			</div>
            <!-- Side Panel for mobile and tablet devices in landscape mode -->
            <div class="hamburger-menu-icons">
                <button class="mobile-menu-icon hamburger-icon">&#9776;</button>
                <button class="mobile-menu-icon cross-icon">&#735;</button>
            </div>
            <div class="m-pdu-home-row1 m-pdu-home-col4 mobile-menu" id="side-panel-id" style="height:calc(100vh)">
                <div class="pdu-metering-side-panel">	
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr class="pdu-metering-side-panel-header">
                                <td class="pdu-metering-side-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Power Distribution
                                    </div>
                                </td>
                                <td class="pdu-metering-side-panel-header-right" style="background:#222222; border:0">
                                    <img class="logo" src="./images/ABB_Logo_Screen_RGB_25px_@1x.png">
                                </td>
                            </tr>
                            <!--<tr>
                                <td class="pdu-metering-side-panel-content" colspan="2" style="background:#222222; border:0;">											
                                    <div>								
                                        <table style="background:#222222; margin-bottom:0;" class="table">
                                            <tbody><tr>

                                                <td style="text-align: center; color: #858585;" class="ng-binding">
                                                    {{aboutInfo.Name}}
                                                </td>

                                            </tr>
                                        </tbody></table>
                                    </div>
                                </td>
                            </tr>-->
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel">	
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr>
                                <td class="pdu-metering-side-panel-content" colspan="2" style="background:#222222; border:0; padding-top: 15px;">											
                                    <div>								
                                        <table style="background:#222222; margin-bottom:0;" class="table">
                                            <tbody><tr>
                                                <td class="col-xs-6 ng-binding text-center pdu-metering-side-panel-time" style="color: #d2d2d2; font-size: 15px">
                                                    {{Time}} {{Meridiem}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col-xs-6 ng-binding text-center pdu-metering-side-panel-date">	
                                                    {{Day}} {{customDateShort}}
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel">	
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr class="pdu-metering-side-panel-header">
                                <td class="pdu-metering-side-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Status
                                    </div>
                                </td>
                                <td class="pdu-metering-side-panel-header-right" style="background:#222222; border:0">
                                </td>
                            </tr>
                            <tr>
                                <td class="pdu-metering-side-panel-content" colspan="2" style="background:#222222; border:0;">											
                                    <div>								
                                        <table style="background:#222222; margin-bottom:0;" class="table">
                                            <tbody><tr>
                                                <td class="col-xs-6" style="text-align: center; color: #858585;">	
                                                    <img width="24" height="24" src="./images/icons/status/{{systemStateSource}}.png" class="ng-scope">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col-xs-6 ng-binding" style="text-align: center; color: #858585;">	
                                                    {{systemState}}
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel">
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr class="pdu-metering-home-status-panel-header">
                                <td class="pdu-metering-home-status-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Load
                                    </div>
                                </td>
                            </tr>
                            <tr>						
                                <td class="pdu-metering-home-status-panel-content" colspan="2" style="background:#222222; border:0;">
                                    <div><!--  style="margin-top: calc(1vh);" -->
                                        <canvas ng-if="showPie" width="70px" height="70px" id="pduPieChart" class="chart chart-doughnut mini-canvas" chart-options="optionspie" chart-data="datapie" chart-labels="labelspie" chart-colors="colorspie"></canvas>
                                    </div>	
                                    <div style="background:#222222; color: #858585; margin-top: -5px; margin-bottom: 5%;width: 100%;text-align: center;" class="table">								
                                        <table style="/* width: 100%; */margin-bottom: 0px;display: inline-block;">
                                            <tbody><tr>														
                                                <td class="col-xs-1" style="font-family: HelveticaNeueETPro-Light;/* float:right; */font-size: 10px;/* padding-left: 20%; */">
                                                    0
                                                </td>
                                                <td class="col-xs-12" style="font-family: HelveticaNeueETPro-Light;font-size: 10px;/* padding-right: 10px; */float: right;">
                                                    100
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </div>									
                                    <div style="background:#222222;" class="table">	
                                        <table style="width: 100%;">
                                            <tr>
                                                <td class="text-center pdu-metering-side-panel-load" style="font-family: HelveticaNeueETPro-Light; color: #858585;">
                                                    Load Power
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel">
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr>
                                <td class="pdu-metering-home-status-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Energy
                                    </div>
                                </td>
                            </tr>
                            <tr>		
                                <td class="pdu-metering-home-status-panel-content" colspan="2" style="background:#222222; border:0; text-align: center;height: 100%;padding: 0 0 10px">

                                        <div style="background:#222222;margin-bottom: 0px;" class="table">								
                                        <table style="width: 100%; margin-bottom: 0px;">
                                            <tr>
                                                <td class="text-center pdu-metering-side-panel-energy-demand">
                                                    {{energy.kWh.Total}}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>			
                            </tr>
                            <tr>
                                <td class="pdu-metering-home-status-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Max Demand
                                    </div>
                                </td>
                            </tr>
                            <tr>		
                                <td class="pdu-metering-home-status-panel-content" colspan="2" style="background:#222222; border:0; text-align: center; height: 100%;padding: 0 0 10px">

                                        <div style="background:#222222;margin-bottom: 0px;" class="table"><!-- margin-top: calc(3vh) -->								
                                        <table style="width: 100%; margin-bottom: 0px;">
                                            <tr>
                                                <td class="text-center pdu-metering-side-panel-energy-demand">
                                                    {{energy.Demand.MD}}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>			
                            </tr>
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel pdu-metering-side-panel-service">	
                    <table class="table pdu-metering-side-panel-table" style="">
                        <tbody>									
                            <tr>
                                <td class="pdu-metering-side-panel-content" colspan="2" style="background:#222222; border:0;vertical-align: bottom; padding-bottom: 0px;">											
                                    <div>								
                                        <table style="background:#222222;" class="table">																										
                                            <tbody>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        <img width="20" height="20" src="./images/icons/nav/UI_UserInCircle_24.png">
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right">	
                                                        Service
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        IP
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right ng-binding">	
                                                        {{networkDetails.IP}}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        Location
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right ng-binding">	
                                                        {{aboutInfo.Location}}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        Serial No
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right ng-binding">	
                                                        {{aboutInfo.SerialNo}}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        Rating
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right ng-binding">	
                                                        {{rating.kW}} kVA
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left" colspan="2">	
                                                        <img src="./images/icons/{{sysConfigAudio}}.png" width="20" height="20"/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="pdu-metering-side-panel-content-left" colspan="2" style="font-size: 10px; text-align: right; padding-right: 5px; ">	
                                                        Version: {{versionNumber}}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="pdu-metering-side-panel-content-left" colspan="2" style="font-size: 10px; text-align: right; padding-right: 5px; padding-top: 0;">														
                                                        Build: {{buildNumber}}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>				
                    </table>
                </div>
            </div>
			<!-- Side Panel -->
            <div class="pdu-home-row1 pdu-home-col4 desktop-menu" id="side-panel-id" style="height:calc(100vh)">
                <div class="pdu-metering-side-panel">	
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr class="pdu-metering-side-panel-header">
                                <td class="pdu-metering-side-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Power Distribution
                                    </div>
                                </td>
                                <td class="pdu-metering-side-panel-header-right" style="background:#222222; border:0">
                                    <img class="logo" src="./images/ABB_Logo_Screen_RGB_25px_@1x.png">
                                </td>
                            </tr>
                            <!--<tr>
                                <td class="pdu-metering-side-panel-content" colspan="2" style="background:#222222; border:0;">											
                                    <div>								
                                        <table style="background:#222222; margin-bottom:0;" class="table">
                                            <tbody><tr>

                                                <td style="text-align: center; color: #858585;" class="ng-binding">
                                                    {{aboutInfo.Name}}
                                                </td>

                                            </tr>
                                        </tbody></table>
                                    </div>
                                </td>
                            </tr>-->
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel">	
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr>
                                <td class="pdu-metering-side-panel-content" colspan="2" style="background:#222222; border:0; padding-top: 15px;">											
                                    <div>								
                                        <table style="background:#222222; margin-bottom:0;" class="table">
                                            <tbody><tr>
                                                <td class="col-xs-6 ng-binding text-center pdu-metering-side-panel-time" style="color: #d2d2d2; font-size: 15px">
                                                    {{Time}} {{Meridiem}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col-xs-6 ng-binding text-center pdu-metering-side-panel-date">	
                                                    {{Day}} {{customDateShort}}
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel">	
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr class="pdu-metering-side-panel-header">
                                <td class="pdu-metering-side-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Status
                                    </div>
                                </td>
                                <td class="pdu-metering-side-panel-header-right" style="background:#222222; border:0">
                                </td>
                            </tr>
                            <tr>
                                <td class="pdu-metering-side-panel-content" colspan="2" style="background:#222222; border:0;">											
                                    <div>								
                                        <table style="background:#222222; margin-bottom:0;" class="table">
                                            <tbody><tr>
                                                <td class="col-xs-6" style="text-align: center; color: #858585;">	
                                                    <img width="24" height="24" src="./images/icons/status/{{systemStateSource}}.png" class="ng-scope">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="col-xs-6 ng-binding" style="text-align: center; color: #858585;">	
                                                    {{systemState}}
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel">
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr class="pdu-metering-home-status-panel-header">
                                <td class="pdu-metering-home-status-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Load
                                    </div>
                                </td>
                            </tr>
                            <tr>						
                                <td class="pdu-metering-home-status-panel-content" colspan="2" style="background:#222222; border:0;">
                                    <div><!--  style="margin-top: calc(1vh);" -->
                                        <canvas ng-if="showPie" width="90px" height="90px" id="pduPieChart" class="chart chart-doughnut mini-canvas" chart-options="optionspie" chart-data="datapie" chart-labels="labelspie" chart-colors="colorspie"></canvas>
                                    </div>	
                                    <div style="background:#222222; color: #858585; margin-top: -5px; margin-bottom: 5%;width: 100%;text-align: center;" class="table">								
                                        <table style="/* width: 100%; */margin-bottom: 0px;display: inline-block;">
                                            <tbody><tr>														
                                                <td class="col-xs-1" style="font-family: HelveticaNeueETPro-Light;/* float:right; */font-size: 10px;/* padding-left: 20%; */">
                                                    0
                                                </td>
                                                <td class="col-xs-12" style="font-family: HelveticaNeueETPro-Light;font-size: 10px;/* padding-right: 10px; */float: right;">
                                                    100
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </div>									
                                    <div style="background:#222222;" class="table">	
                                        <table style="width: 100%;">
                                            <tr>
                                                <td class="text-center" style="font-family: HelveticaNeueETPro-Light; color: #858585;">
                                                    Load Power
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel">
                    <table class="table pdu-metering-side-panel-table">
                        <tbody>
                            <tr>
                                <td class="pdu-metering-home-status-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Energy
                                    </div>
                                </td>
                            </tr>
                            <tr>		
                                <td class="pdu-metering-home-status-panel-content" colspan="2" style="background:#222222; border:0; text-align: center;height: 100%;padding: 0 0 10px">

                                        <div style="background:#222222;margin-bottom: 0px;" class="table">								
                                        <table style="width: 100%; margin-bottom: 0px;">
                                            <tr>
                                                <td class="text-center pdu-metering-side-panel-energy-demand">
                                                    {{energy.kWh.Total}}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>			
                            </tr>
                            <tr>
                                <td class="pdu-metering-home-status-panel-header-left" style="background:#222222; border:0">
                                    <div>
                                        Max Demand
                                    </div>
                                </td>
                            </tr>
                            <tr>		
                                <td class="pdu-metering-home-status-panel-content" colspan="2" style="background:#222222; border:0; text-align: center; height: 100%;padding: 0 0 5px">

                                        <div style="background:#222222;margin-bottom: 0px;" class="table"><!-- margin-top: calc(3vh) -->								
                                        <table style="width: 100%; margin-bottom: 0px;">
                                            <tr>
                                                <td class="text-center pdu-metering-side-panel-energy-demand">
                                                    {{energy.Demand.MD}}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>			
                            </tr>
                        </tbody>				
                    </table>
                </div>
                <div class="pdu-metering-side-panel pdu-metering-side-panel-service">	
                    <table class="table pdu-metering-side-panel-table" style="">
                        <tbody>									
                            <tr>
                                <td class="pdu-metering-side-panel-content" colspan="2" style="background:#222222; border:0;vertical-align: bottom; padding-bottom: 0px;">											
                                    <div>								
                                        <table style="background:#222222;" class="table">																										
                                            <tbody>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        <img width="20" height="20" src="./images/icons/nav/UI_UserInCircle_24.png">
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right">	
                                                        Service
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        IP
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right ng-binding">	
                                                        {{networkDetails.IP}}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        Location
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right ng-binding">	
                                                        {{aboutInfo.Location}}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        Serial No
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right ng-binding">	
                                                        {{aboutInfo.SerialNo}}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left">	
                                                        Rating
                                                    </td>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-right ng-binding">	
                                                        {{rating.kW}} kVA
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="col-xs-6 pdu-metering-side-panel-content-left" colspan="2">	
                                                        <img src="./images/icons/{{sysConfigAudio}}.png" width="20" height="20"/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="pdu-metering-side-panel-content-left" colspan="2" style="font-size: 10px; text-align: right; padding-right: 5px; ">	
                                                        Version: {{versionNumber}}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="pdu-metering-side-panel-content-left" colspan="2" style="font-size: 10px; text-align: right; padding-right: 5px; padding-top: 0;">														
                                                        Build: {{buildNumber}}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>				
                    </table>
                </div>
            </div>
		</div>		
		
		<div class="clearfix visible-lg"></div>
		
	</div>	
  </body>  
</html>
