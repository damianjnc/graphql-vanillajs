const continentSelect = document.getElementById('continent-select')
const countryList = document.getElementById('countries-list')

const queryFetch = async (query, variables) => {
  try {
    const response = await fetch('https://countries.trevorblades.com/', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        query: query,
        variables
      })
    })

    const data = await response.json()

    return data

  } catch (e) {
    console.log(e)
  }
}

const getData = async () => {
  const data = await queryFetch(`
  {
    continents{
      name
      code
    }
  }
`)

  data.data.continents.forEach(continent => {
    const option = document.createElement('option')
    option.value = continent.code
    option.innerText = continent.name
    continentSelect.append(option)
  })
}

const getContinentCountries = async continentCode => {
  const data = await queryFetch(`
    query getCountries($code: String){
    continent(code: $code){
      name
      countries {
        name
        native
       currency
      }
    }
  }
    `, {code: continentCode})

  return data
}

getData()

continentSelect.addEventListener('change', async ev => {
  const continentCode = ev.target.value
  const countries = await getContinentCountries(continentCode)

  countryList.innerHTML = ''
  countries.forEach(country => {
    const element = document.createElement('div')
    element.innerText = country.name
    countryList.append(element)
  })
})
