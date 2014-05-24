###SPA Code Camper

A 2 parts course by extraordinaire/star developer [John Papa](https://github.com/johnpapa).
The course is available at Pluralsight:

[Building Apps with Angular and Breeze - Part 1](http://pluralsight.com/training/Courses/TableOfContents/build-apps-angular-breeze)

Source code for Part 1 is [tagged v1.0](https://github.com/leniel/SPACodeCamper/tree/v1.0).

[Building Apps with Angular and Breeze - Part 2](http://pluralsight.com/training/Courses/TableOfContents/build-apps-angular-breeze-part2)

I'm doing the course using Visual Studio 2013 Update 2...

In this file I describe some errors I got in Visual Studio and how I solved them along the way.

There are some things/NuGet packages that changed since the course went live on Pluralsight on 10/22/2013 and 12/23/2014 respectively:  

#### Part 1

1.1 - Instead of

`Install-Package Breeze.WebApi`

run

`Install-Package Breeze.WebApi2.EF6`

1.2 - In `index.html`, change:

```HTML
<script src="scripts/breeze.directives.js"></script>
```

to 

```HTML
<script src="scripts/breeze.directives.validation.js"></script>
```

1.3 - On step 3.15 I got this error after adding the Breeze Web API Controller to `CC.Web` project.

```Text
Error    2	Assembly 'Breeze.WebApi2, Version=1.4.0.0, Culture=neutral, PublicKeyToken=f6085f1a45e2ac59' uses 'System.Web.Http, Version=5.1.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35' which has a higher version than referenced assembly 'System.Web.Http, Version=5.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35'	c:\Repos\SPACodeCamper\packages\Breeze.Server.WebApi2.1.4.12\lib\Breeze.WebApi2.dll	CC.Web
```

To solve it we need to update the following NuGet Packages. I used NuGet Package Manager in Visual Studio 2013:

* Microsoft.AspNet.WebApi.Client from 5.0.0 to 5.1.2
* Microsoft.AspNet.WebApi.Core from 5.0.0 to 5.1.2
* Microsoft.AspNet.WebApi.WebHost from 5.0.0 to 5.1.2
* Microsoft.AspNet.WebApi.OData from 5.0.0 to 5.1.2 (this one I had to restart Visual Studio to complete the installation)

Updating the NuGet packages above will take care of bumping `System.Web.Http`'s version to the correct one, in this case 5.1.

1.4 - Additional NuGet Packages I updated by myself (there was no need to update though)

**CC.Web**

* jQuery from 2.0.3 to 2.1.1
* Json.NET from 4.5.11 to 6.0.3
* moment from 2.5.0 to 2.6.0
* bootstrap from 3.0.3 to 3.1.1
* Microsoft.SqlServer.Compact from 4.0.8854.1 to 4.0.8876.1
* toastr from 2.0.1 to 2.0.2
* spin.js from 1.3 to 2.0
* AngularJS.Core from 1.2.9 to 1.2.16
* AngularJS.Route from 1.2.9 to 1.2.16
* AngularJS.Animate from 1.2.9 to 1.2.16
* AngularJS.Sanitize from 1.2.9 to 1.2.16
* Breeze.Angular from 0.8.3 to 0.8.5
* Breeze.Angular.Directives from 1.3.2 to 1.3.6

<hr>

**CC.DataAccess**

* EntityFramework from 6.0.1 to 6.1.0
* Json.NET from 5.0.8 to 6.0.3

<hr>

**CC.Model**

* Json.NET from 5.0.6 to 6.0.3

Make sure you also update the scripts references in `index.html` to:

```HTML
<script src="scripts/jquery-2.1.1.js"></script>
```

and

```HTML
<script src="scripts/breeze.directives.js"></script> instead of

<script src="scripts/breeze.directives.validation.js"></script>
```

1.5 - On step 4.10 `breeze.core.extendQ` is not available.

Check this StackOverflow question: http://stackoverflow.com/q/22118797/114029

In `app.js` pass the `breeze` dependency directly:

```JavaScript
// Handle routing errors and success events
// Trigger breeze configuration
app.run(['$route', 'breeze', function($route, breeze)
{
// Include $route to kick start the router. 
}]);
```

In `datacontext.js` do:

```JavaScript
return EntityQuery.from('Sessions')
.select('id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags')
.orderBy(orderBy)
.toType('Session')
.using(manager).execute()
.then(querySucceeded, _queryFailed);
```

Get rid of `breeze.to$q.shim.js` in `index.html` and delete the file from the `\Scripts` folder in the project since it's not needed anymore.

1.6 - In `sessions.html`, change

```HTML
<img data-cc-img-person="{{s.speaker.imageSource}}" class="img-polaroid user-pic" />
```                          

to

```HTML
<img data-cc-img-person="{{s.speaker.imageSource}}" class="img-thumbnail user-pic" />
```

`img-thumbnail` CSS class adds that nice border to the image.

1.7 - On step 5.9 in `sessions.html` change 

```HTML
<small class="right hidden-phone">{{s.code}}</small>
```

to

```HTML
<small class="right hidden-xs hidden-sm">{{s.code}}</small>
```

In `Bootstrap 3` the responsive utilities were revamped. Now the class names are `hidden-xs` and `hidden-sm` for small screen devices.

More details here: http://getbootstrap.com/css/#responsive-utilities

1.8 - Installed `Angular.UI.Bootstrap` NuGet package to get automatic updates. So get rid of this file `\Scripts\ui-bootstrap-tpls-0.10.0.js` that had been previously added manually to the project.

These are the new files to be added in `index.html`:

```HTML
<script src="scripts/angular-ui/ui-bootstrap-tpls.js"></script>
<script src="scripts/angular-ui/ui-bootstrap.js"></script>
```

Make sure you remove the old reference to `ui-bootstrap-tpls-0.10.0.js`.

1.9 - Changed the progress bar code in `index.html` from

```HTML
<div class="progress progress-striped active page-progress-bar">
        <div class="bar"></div>
</div>
```

to

```HTML
<div class="progress progress-striped active page-progress-bar">
    <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
    </div>
</div>
```

1.10 - On step 8.4, style the search `<input>` control like this to conform with Bootstrap 3 styles:

```HTML
<div class="col-lg-4">
    <input class="form-control search-query"
           data-ng-model="vm.speakerSearch"
           placeholder="live search..." />
</div>
````

More about it here: http://stackoverflow.com/a/18901085/114029

1.11 - On step 8.7 we must do some `CSS` changes to the search input in `sidebar.html` to fix it to conform with Bootstrap 3 styles:

Use this modified HTML:

```HTML
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
```

We're using a button addon as described here:
http://getbootstrap.com/components/#input-groups-buttons

and remove or comment the `font-size` property in `/content/customtheme.css`

```CSS


*
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    /*font-size: 13px !important;*/
}
```

1.12 - On step 9.4 change the pagination class to conform with Bootstrap 3:

instead of `class="pagination-small"` use `class="pagination-sm"`

http://getbootstrap.com/components/#pagination

1.13 - On step 9.10 and *ONLY IF* you installed the latest `Angular.UI.Bootstrap` (as of now version 0.11.0) as descreibed on item 8 above, the `<pagination>` control/directive in `attendees.html` needs to be changed since there's a breaking change as described here:

https://github.com/angular-ui/bootstrap/issues/2157
https://github.com/angular-ui/bootstrap/blob/master/CHANGELOG.md#breaking-changes

This is the correct HTML now:

```HTML
<pagination boundary-links="true"
            total-items="vm.attendeesFilteredCount"
            items-per-page="vm.paging.pageSize"
            data-ng-model="vm.paging.currentPage"
            data-ng-change="vm.pageChanged()"
            max-size="vm.paging.maxPagesToShow"
            class="pagination-sm"
            previous-text="Prev"
            next-text="Next"
            first-text="First"
            last-text="Last"></pagination>
```

Note the introduction of `data-ng-model` bound to `vm.paging.currentPage` and `data-ng-change` bound to `vm.pageChanged()` function. There's no page parameter being passed now and so in `attendees.js` the `pageChanged` function must be like this:

```JavaScript
function pageChanged()
{
    getAttendees();
}
```

For more info about the pagination directive, take a look here:

http://angular-ui.github.io/bootstrap/#/pagination

1.14 - Replaced Microsoft map with a Google Maps one in `app\dashboard\dashboard.html`

```HTML
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58970.11446915391!2d-44.02935805219722!3d-22.517980436902008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9ea2ac4b4e5c1d%3A0xd475bc9356fcad22!2sVolta+Redonda+-+RJ!5e0!3m2!1sen!2s!4v1400541976957"
                                    width="400"
                                    height="230"
                                    frameborder="0" scrolling="no" marginwidth="0"
                                    marginheight="0"
                                    style="border:0"></iframe>
```

1.15 - Watch out when passing the `interval` value from the view model to the carousel directive on step 10.8. I declared it like so:

```HTML
<carousel class="carousel-inner" interval="{{vm.speakers.interval}}">
```

but the correct way is:

```HTML
<carousel class="carousel-inner" interval="vm.speakers.interval">
```

and same thing is valid for the `s.active` value. There's no double curly brackets `{{ }}` surrounding those controller properties.

1.16 - While on step 10.8 I got a broken `<carousel>` directive. The problem is described here:

http://stackoverflow.com/questions/22641834/angularjs-corousel-stops-working/22649887#22649887

The solution provided by simonykq here https://github.com/angular-ui/bootstrap/issues/1350#issuecomment-34595075 is really nice. Add a directive in `app/services/directives.js`

```JavaScript
app.directive('disableAnimation', function($animate)
{
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs)
        {
            $attrs.$observe('disableAnimation', function(value)
            {
                $animate.enabled(!value, $element);
            });
        }
    }
});
```

and then make use of it:

```HTML
<carousel class="carousel-inner" interval="vm.speakers.interval" disable-animation="true">
```

1.17 - To fix the `carousel` appearance, do this:

Add these styles in the file `content/styles.css`:

```CSS
.carousel-caption {
    position: static;
    padding-top: 0;
    padding-bottom: 15px;
}

.carousel-indicators {
    display: none;
}

.carousel-inner .thumbnail {
    margin-top: 20px !important;
}
```

#### Part 2

2.1 - On step 4.2 change the button classes to comply with Font-Awesome new icon naming conventions and reestructure the form input controls to match Bootstrap 3 styles.
    I used [Bootstrap 3 Horizontal Form](http://getbootstrap.com/css/#forms).

In `content\customtheme.css`, do these changes...

* Comment out or remove the following blocks:

```CSS
.form-horizontal .control-label {
    width: 90px;
}

.control-label{
    font-weight: 400 !important;
    font-size: 14px;
}
```

* Add the padding properties on line 362:

```CSS
    form label {
        font-size: 13px;
        line-height: 13px;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
```

2.2 - On step 4.6, remember to use `fa fa-asterisk fa-asterisk-large` for the changes indicator icon in `speakerdetail.html`.

2.3 - On step 5.2, do the same overhaul as done in 2.1 above to reformat `app\session\sessiondetails.html`.