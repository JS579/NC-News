# NC News


<a id="readme-top"></a>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About NC News

NC News is a platform, featuring articles written by Northcoders staff and students. The API allows users to filter the articles by topics, as well as sorting by different categories and adding comments to articles. 

Planned updates include being able to query the database to return specified users, updating previously posted comments, posting new articles and removing existing articles, as well as making use of routers.

Hosted version: https://nc-news-1qem.onrender.com/api/


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* Express.js


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* node v23.5.0

* npm v10.9.2

* postgres v3.4.5


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/JS579/NC-News
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a .env.test file containing:
   ```js
   PGDATABASE=nc_news_test
   ```
4. Create a .env.development file containing:
   ```js
   PGDATABASE=nc_news
   ```
5. Include both .env files and all node modules in a .gitignorefile

6. To set up the database:
   ```
   npm run setup-dbs
   ```
7. To seed the database:
   ```
   npm run seed-dev
   ```
8. To test the database:
   ```
   npm run test-seed
   ```
9. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

John Scholefield
johnscho579@gmail.com

Project Link: [https://github.com/JS579/NC-News](https://github.com/JS579/NC-News)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

