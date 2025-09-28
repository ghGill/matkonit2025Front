import './App.css'
import { useEffect } from 'react'
import OpenPage from './pages/open/Open'
import RecipesPage from './pages/recipes/recipes'
import CategoriesPage from './pages/categories/Categories'
import { Route } from 'wouter'
import { DeviceResolutionProvider } from './contents/DeviceResolution'
import api from './api/api'

import { Provider } from 'react-redux'
import { useDispatch } from 'react-redux'
import { store } from './store/store'
import { setRecipes } from './store/recipeSlice'
import { setCategories } from './store/categorySlice'

function LoadData({ children }: any) {
  const dispatch = useDispatch();

  const readAllData = async () => {
    const categories: any = await api.getAllCategories();
    if (categories.success) {
      dispatch(setCategories([{ id: -1, name: '' }, { id: 0, name: 'הכל' }, ...categories.data]));
    }
    else {
      dispatch(setCategories([]));
    }

    const recipes: any = await api.getAllRecipes();

    if (recipes.success) {
      dispatch(setRecipes(recipes.data));
    }
    else {
      dispatch(setRecipes([]));
    }
  }

  useEffect(() => {
    readAllData();
  }, [])

  return (
    <>
      {children}
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <DeviceResolutionProvider>
        <LoadData>
          <Route path="/" component={OpenPage} />
          <Route path="/recipes" component={RecipesPage} />
          <Route path="/categories" component={CategoriesPage} />
        </LoadData>
      </DeviceResolutionProvider>
    </Provider>
  )
}

export default App
