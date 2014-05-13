Course available at Pluralsight: http://pluralsight.com/training/Courses/TableOfContents/build-apps-angular-breeze

I'm doing the course using Visual Studio 2013 Update 2...

In this file I describe some errors I got in Visual Studio and how I solved them algon the way.

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

- jQuery from 2.0.3 to 2.1.0
- Json.NET from 4.5.11 to 6.0.3

Make sure you also update the scripts references in index.html to:

<script src="scripts/jquery-2.1.0.js"></script>