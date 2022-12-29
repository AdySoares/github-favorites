export class GithubUser{
  static search(username){
    const ApiGithub = `https://api.github.com/users/${username}`

    return fetch(ApiGithub).then(data => data.json()).then(({followers, name, login, public_repos})=> (
      {followers,
      name,
      login,
      public_repos}))
  }
}