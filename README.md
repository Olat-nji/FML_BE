# Fund My Laptop - Backend

### Installation

1. Click on Fork button at the top right corner to fork the repo.

2. Clone your forked repository to your local environment.

3. Navigate into the cloned folder - <code>cd FML-BE</code>

4. Add upstream - <code>git remote add upstream https://github.com/hngi/FML-BE.git</code>

5. Pull updates from the upstream - <code>git pull upstream develop</code>

6. Create a new branch for the feature you're working on - <code>git checkout -b [Feature]</code>

<code>e.g git checkout -b implemented_notification_api</code>


### Running the server locally

1. Install all dependencies - <code>npm install</code>

2. Copy the contents of <code>env.test</code> to <code>.env</code>

3. Start up the server - <code>npm start</code> | <code>npm run dev</code>

4. Server should be running on http://localhost:2020/


### Creating a pull request

1. To ensure you're on the right branch run <code>git branch</code>

2. If everything is okay stage your changes -  <code>git add .</code>

3. And then commit - <code>git commit -m "< COMMIT MESSAGE >"</code>

4. Pull upstream to avoid merge conflicts - <code>git pull upstream develop</code>

5. Push to your forked repo - <code>git push origin < BRANCH_NAME ></code>

6. Go to the repository https://github.com/hngi/FML-BE

7. As soon as you get there, you are going to see a green ‘compare and create a pull request’

8. Click on it, and type your message, click on create pull request.
