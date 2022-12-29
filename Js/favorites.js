//Api do GitHub:
import { GithubUser } from "./GithubUser.js"

// Dados da aplicação:
export class DataFavorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
    this.tbody = this.root.querySelector('table tbody')
  }

  load(){
    this.bd = JSON.parse(localStorage.getItem('@github-favorites')) || []
  }

  save(){
    localStorage.setItem('@github-favorites', JSON.stringify(this.bd))
  }

  async AddUser(NickName){
    try{
      const newUser = await GithubUser.search(NickName)
      
      const index = this.bd.findIndex(users => users.login === newUser.login)

      if(index !== -1){
       throw new Error('Usuário já cadastrado')
      }
      
      if(!newUser.login){
        throw new Error('Usuário Inexiste')
      }

        this.bd = [newUser, ...this.bd]
        this.update()
        this.save()
      
    }
    catch(error) {
      alert(error.message)
    }
  }

  DeleteUser(deleteUser){
   this.bd = this.bd.filter(data => data !== deleteUser)
   this.update()
   this.save()
  }

}

// Construção do HTML:
export class FavoritesViw extends DataFavorites{
  constructor(root){
    super(root)
    this.update()
    this.searchUser()
  }

  update(){
    this.clearRowsInit()
    this.bd.forEach(user => {
      const row = this.AppendData(user)
      this.tbody.append(row)
      this.deleteRow(row,user)
    })
  }

  searchUser(){
    const btnSearch = this.root.querySelector('.Search button')
    const input =  this.root.querySelector('.Search input')
    btnSearch.onclick = () => {
      const { value } = this.root.querySelector('.Search input')
      
      this.AddUser(value)
    }

    input.addEventListener('keypress',(event)=>{
      if(event.key === 'Enter'){
        const { value } = this.root.querySelector('.Search input')
      
        this.AddUser(value)
      }
    })

  }

  clearRowsInit(){
    this.tbody.querySelectorAll('tr').forEach(rows => {
      rows.remove()
    })
  }

  createNewRow(){
    this.tr = document.createElement('tr')
    this.tr.innerHTML = `
      <tr>
      <td class="User">
        <img src="https://www.github.com/loginUser.png" alt="Imagem do usuário de loginUser">
        <a href="https://www.github.com/loginUser" target="_blank">
          <p>UserName</p>
          <span>loginUser</span>
        </a>
      </td>
      <td class="Repositores">
        NunRepo
      </td>
      <td class="Followers">
        NunFollowers
      </td>
      <td>
        <button id="btnRemove" class="Remove">&times;</button>
      </td>
    </tr>
    `
    return this.tr
  }

  AppendData(user){
    const row = this.createNewRow()

    row.querySelector('.User img').src = `https://www.github.com/${user.login}.png`
    row.querySelector('.User img').alt = `Imagem do usuário ${user.login}`
    row.querySelector('a').href = `https://www.github.com/${user.login}`
    row.querySelector('a p').textContent = `${user.name}`
    row.querySelector('a span').textContent = `${user.login}`
    row.querySelector('.Repositores').textContent = `${user.public_repos}`
    row.querySelector('.Followers').textContent = `${user.followers}`

    return row
  }

  deleteRow(row, deleteUser){
    row.querySelector('.Remove').addEventListener('click', () => {
      const isOk = confirm(`Deseja realmente apagar essa linha`)
      if(isOk){
        this.DeleteUser(deleteUser)
      }
    })
  }
}