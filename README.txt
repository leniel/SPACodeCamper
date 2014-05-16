Course available at Pluralsight: http://pluralsight.com/training/Courses/TableOfContents/build-apps-angular-breeze

I'm doing the course using Visual Studio 2013 Update 2...

In this file I describe some errors I got in Visual Studio and how I solved them along the way.

There are some things/NuGet packages changed since the course went live on Pluralsight on 10/22/2013:  


1 - Instead of Install-Package Breeze.WebApi run

Install-Package Breeze.WebApi2.EF6


2 - Change:

<script src="scripts/breeze.directives.js"></script>

to 

<script src="scripts/breeze.directives.validation.js"></script>

in index.html


3 - On step 3.15 I got this error after adding the Breeze Web API Controller to CC.Web.

Error	2	Assembly 'Breeze.WebApi2, Version=1.4.0.0, Culture=neutral, PublicKeyToken=f6085f1a45e2ac59' uses 'System.Web.Http, Version=5.1.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35' which has a higher version than referenced assembly 'System.Web.Http, Version=5.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35'	c:\Repos\SPACodeCamper\packages\Breeze.Server.WebApi2.1.4.12\lib\Breeze.WebApi2.dll	CC.Web


To solve it we need to update the following NuGet Packages. I used NuGet Package Manager in Visual Studio 2013:

- Microsoft.AspNet.WebApi.Client from 5.0.0 to 5.1.2
- Microsoft.AspNet.WebApi.Core from 5.0.0 to 5.1.2
- Microsoft.AspNet.WebApi.WebHost from 5.0.0 to 5.1.2
- Microsoft.AspNet.WebApi.OData from 5.0.0 to 5.1.2 (this one I had to restart Visual Studio to complete the installation)

Updating the NuGet packages above will take care of bumping System.Web.Http's version to the correct one, in this case 5.1.

4 - Additional NuGet Packages I updated by myself (there was no need to update though)

CC.Web
- jQuery from 2.0.3 to 2.1.1
- Json.NET from 4.5.11 to 6.0.3
- moment from 2.5.0 to 2.6.0
- bootstrap from 3.0.3 to 3.1.1
- Microsoft.SqlServer.Compact from 4.0.8854.1 to 4.0.8876.1
- toastr from 2.0.1 to 2.0.2
- spin.js from 1.3 to 2.0
- AngularJS.Core from 1.2.9 to 1.2.16
- AngularJS.Route from 1.2.9 to 1.2.16
- AngularJS.Animate from 1.2.9 to 1.2.16
- AngularJS.Sanitize from 1.2.9 to 1.2.16
- Breeze.Angular from 0.8.3 to 0.8.5
- Breeze.Angular.Directives from 1.3.2 to 1.3.6

CC.DataAccess
- EntityFramework from 6.0.1 to 6.1.0
- Json.NET from 5.0.8 to 6.0.3

CC.Model
- Json.NET from 5.0.6 to 6.0.3


Make sure you also update the scripts references in index.html to:

<script src="scripts/jquery-2.1.1.js"></script>

and

<script src="scripts/breeze.directives.js"></script> instead of

<script src="scripts/breeze.directives.validation.js"></script>


5 - breeze.core.extendQ not available on step 4.10

Check this StackOverflow question: http://stackoverflow.com/q/22118797/114029

In app.js pass the breeze dependency directly:

// Handle routing errors and success events
// Trigger breeze configuration
app.run(['$route', 'breeze', function($route, breeze)
{
    // Include $route to kick start the router.
}]);

In datacontext.js do:

return EntityQuery.from('Sessions')
    .select('id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags')
    .orderBy(orderBy)
    .toType('Session')
    .using(manager).execute()
    .then(querySucceeded, _queryFailed);

Get rid of breeze.to$q.shim.js from index.html and delete the file from the \Scripts folder in the project since it's not needed anymore.


6 - In sessions.html, change

<img data-cc-img-person="{{s.speaker.imageSource}}" class="img-polaroid user-pic" />
                          
to

<img data-cc-img-person="{{s.speaker.imageSource}}" class="img-thumbnail user-pic" />

img-thumbnail CSS class adds that nice border to the image.


7 - In sessions.html on step 5.9, change 

<small class="right hidden-phone">{{s.code}}</small>

to

<small class="right hidden-xs hidden-sm">{{s.code}}</small>

In Bootstrap 3 the responsive utilities were revamped. Now the class names are hidden-xs and hidden-sm for small screen devices.

More details here: http://getbootstrap.com/css/#responsive-utilities


8 - Installed Angular.UI.Bootstrap NuGet package to get automatic updates. So get rid of this file \Scripts\ui-bootstrap-tpls-0.10.0.js that had been previously added manually to the project.

These are the new files to be added in index.html:

 <script src="scripts/angular-ui/ui-bootstrap-tpls.js"></script>
 <script src="scripts/angular-ui/ui-bootstrap.js"></script>


9 - Changed progress bar code in index.html from

<div class="progress progress-striped active page-progress-bar">
        <div class="bar"></div>
</div>

to

<div class="progress progress-striped active page-progress-bar">
    <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
    </div>
</div>


10 - On step 8.4, style the search input control like this to conform with Bootstrap 3 styles:

 <div class="col-lg-4">
    <input class="form-control search-query"
           data-ng-model="vm.speakerSearch"
           placeholder="live search..." />
 </div>

 More about it here: http://stackoverflow.com/a/18901085/114029


 11 - On step 8.7 we must do some CSS changes to the search input in sidebar.html to fix it to conform with Bootstrap 3 styles:

Use this modified HTML:

<div class="sidebar-widget">
    <div class="row">
        <div class="col-lg-12">
            <div class="input-group search">
                <input type="text"
                        class="form-control"
                        data-ng-model="vm.searchText"
                        data-ng-keyup="vm.search($event)"
                        placeholder="Find sessions" />
                <span class="input-group-btn">
                    <button class="btn btn-info btn-notext" type="button" data-ng-click="vm.search($event)">
                        <i class="fa fa-search"></i>
                    </button>
                </span>
            </div>
        </div>
    </div>
</div>

We're using a button addon as described here:
http://getbootstrap.com/components/#input-groups-buttons

and remove or comment the font-size property in /content/customtheme.css

.btn {
    background-image: none !important;
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    /*font-size: 13px !important;*/
}

