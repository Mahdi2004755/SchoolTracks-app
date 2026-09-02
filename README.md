# SchoolTracks

SchoolTracks is a full-stack assignment tracker that helps students organize their coursework and decide what to work on first. It calculates a priority score for each assignment based on its due date, weight, completion status, current course grade, and estimated study time.

## Features

- Add, edit, and delete assignments
- Track deadlines and completion status
- Calculate a priority score for each assignment
- Generate recommendations based on upcoming work
- Create a daily study plan using the top three priorities
- Filter assignments by course, status, due date, and weight
- Sort assignments by priority, due date, course, weight, or status
- Switch between table and card views
- Estimate how an assignment may affect a course grade
- Store assignment data locally using SQLite

## Tech Stack

### Frontend

- React
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express
- SQLite

## Getting Started

### Requirements

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) version 18 or newer
- npm
- Git

You can check your installed versions with:

```bash
node -v
npm -v
git --version
```

### Clone the Repository

```bash
git clone https://github.com/Mahdi2004755/SchoolTracks-app.git
cd SchoolTracks-app
```

If you downloaded the project as a ZIP file, extract it and open the project folder in your terminal.

### Install Dependencies

From the main project folder, run:

```bash
npm run install:all
```

This installs the dependencies for both the frontend and backend.

### Run the Application

```bash
npm run dev
```

Once the application starts, open the following links:

- Web app: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:4000](http://localhost:4000)
- API health check: [http://localhost:4000/health](http://localhost:4000/health)

To stop the application, press `Ctrl+C` in the terminal.

## How It Works

### Managing Assignments

Users can add assignments with the following information:

- Assignment title
- Course name
- Due date
- Weight toward the final grade
- Current course grade
- Expected assignment grade
- Completion status
- Estimated study time

Assignments can be edited or deleted at any time.

### Priority System

Each open assignment receives a priority score from 0 to 100. A higher score means the assignment should be handled sooner.

The score considers factors such as:

- How close the due date is
- How much the assignment is worth
- The current grade in the course
- The assignment’s completion status
- The estimated amount of work required

Completed assignments receive a priority score of 0 and are removed from the daily study plan.

The priority logic can be found in:

```text
server/services/priorityService.js
```

### Daily Study Plan

SchoolTracks automatically selects the three highest-priority open assignments and adds them to the daily study plan. This gives students a simple starting point when deciding what to work on.

### Grade Impact Calculator

The grade-impact calculator estimates how many percentage points an assignment could contribute to the final course grade.

The calculation is:

```text
Contribution = (Assignment weight ÷ 100) × Expected grade
```

For example, an expected grade of 88% on an assignment worth 25% would contribute:

```text
(25 ÷ 100) × 88 = 22 percentage points
```

This is intended as a planning estimate and does not replace an official course-grade calculation.

## Data Storage

Assignment data is stored locally in a SQLite database:

```text
server/data/assignments.db
```

The database is included in `.gitignore`, so personal assignment and grade information is not uploaded to GitHub.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/assignments` | Returns all assignments |
| `POST` | `/assignments` | Creates a new assignment |
| `PUT` | `/assignments/:id` | Updates an existing assignment |
| `DELETE` | `/assignments/:id` | Deletes an assignment |
| `GET` | `/assignments/priorities` | Returns prioritized open assignments and the daily study plan |
| `GET` | `/assignments/impact-preview` | Calculates an estimated grade impact |

## Production Build

To create a production build of the frontend, run:

```bash
npm run build
```

The completed build will be created in:

```text
client/dist
```

The backend must still be hosted separately for the production version to save and retrieve assignments.

## Troubleshooting

### The `npm` command is not recognized

Install the latest LTS version of [Node.js](https://nodejs.org/), then close and reopen your terminal.

### The page cannot load assignments

Make sure `npm run dev` is still running. You can also open the API health check:

[http://localhost:4000/health](http://localhost:4000/health)

If the API is running correctly, it should return a message confirming that the service is available.

### A port is already being used

Make sure another application is not already using port `4000` or `5173`. Close the other application, then run the project again.

### SQLite installation fails

Try using the latest Node.js LTS version. On Windows, some SQLite packages may also require Visual Studio Build Tools.

## Author

Created by [Mahdi2004755](https://github.com/Mahdi2004755).

Project repository: [SchoolTracks-app](https://github.com/Mahdi2004755/SchoolTracks-app)
