# Description

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

Final project for Telerik Academy JS A9 assigned by Tick42 - Design and implement single-page web application that the members of an organization would use for self-regulation and coverage of the organization's standards. A work item which would later be reviewed from the author's colleagues is submitted so that it's author can take advice and improve.

# Getting started

Make sure you have the [Angular CLI](https://github.com/angular/angular-cli#installation) installed globally. 

## Installation

Clone the repository

    git clone https://gitlab.com/Valatar/peer-review-spa

Switch to the repo folder

    cd client
    
Install dependencies
    
    npm install

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# Functionality overview

## General functionality

- Authenticate users - Register, Login, Logout
- Users can create and view work items from the Dashboard
- Users can accept, reject or leave comments under those items
- Users can create teams in which they can invite other users
- The invited users can accept or reject the invitation

## General page breakdown

- Sign in/Sign up pages (URL: /#/login, /#/register) 
    - Uses JWT (store the token in localStorage)
<br />
<a href="./screenshots/login.JPG" target="_blank">
  <img src="./screenshots/login.JPG" width="280" alt="Image" />
</a>
<a href="./screenshots/register.JPG" target="_blank">
  <img src="./screenshots/register.JPG" width="280" alt="Image" />
</a>
<br />


- Dashboard (URL: /#/dashboard)
    - Access the form to create a new work item
    - List of work items you have created
    - List of work items you have been assigned to review

<br />
<a href="./screenshots/dashboard.JPG" target="_blank">
  <img src="./screenshots/dashboard.JPG" width="280" alt="Image" />
</a>
<a href="./screenshots/dashboard-create.JPG" target="_blank">
  <img src="./screenshots/dashboard-create.JPG" width="280" alt="Image" />
</a>
<br />

- Single work item (URL: /#/work-item/:id)
    - See the full content of the work item
    - Choose accept/reject (if you are a reviewer of this item)
    - See/post comments about the current work item

<br />
<a href="./screenshots/item-view.JPG" target="_blank">
  <img src="./screenshots/item-view.JPG" width="280" alt="Image" />
</a>

- Teams (URL: /#/team)
    - Access the form to create a new team
    - List of teams you have created
    - List of invitations you have received to join other teams

<br />
<a href="./screenshots/teams.JPG" target="_blank">
  <img src="./screenshots/teams.JPG" width="280" alt="Image" />
</a>
<a href="./screenshots/teams-inv.JPG" target="_blank">
  <img src="./screenshots/teams-inv.JPG" width="280" alt="Image" />
</a>
<br />

 - Single team (URL: /#/team/:id)
    - Add member to the team
    - List of the team members
    - List of work items which the members of the team have created
    - List of work items which the members of the team are assigned to review

<br />
<a href="./screenshots/team-single-add.JPG" target="_blank">
  <img src="./screenshots/team-single-add.JPG" width="280" alt="Image" />
</a>
<a href="./screenshots/team-single-review.JPG" target="_blank">
  <img src="./screenshots/team-single-review.JPG" width="280" alt="Image" />
</a>
<br />