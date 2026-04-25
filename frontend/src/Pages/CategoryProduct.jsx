import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import VerticalCard from '../components/VerticalCard'
import {
  getAllLocalProducts,
  getLocalCategorySummaries,
  getLocalProductsByCategory,
  productCategoryOptions,
} from '../data/localProducts'

const CategoryProduct = () => {

    const [data,setData] = useState([])
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const location = useLocation()
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")
    const showAll = urlSearch.get("all") === "true"

    const urlCategoryListObject = {}
    urlCategoryListinArray.forEach(el =>{
      urlCategoryListObject[el] = true
    })


    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList, setFilterCategoryList] = useState([])
    const [categories, setCategories] = useState([])

    

    const [sortBy, setSortBy] = useState("")

    const fetchAllCategories = async () => {
      setLoading(true)
      setCategories(getLocalCategorySummaries())
      setLoading(false)
    }

    const fetchAllProducts = async () => {
      setLoading(true)
      // Backend version kept here for easy reactivation later.
      // const response = await fetch(SummaryApi.allProduct.url)
      // const dataResponse = await response.json()
      // setData(dataResponse?.data || [])
      setData(getAllLocalProducts())
      setLoading(false)
    }

    const fetchData = async()=>{
      setLoading(true)
      // Backend version kept here for easy reactivation later.
      // const response = await fetch(SummaryApi.filterProduct.url,{
      //   method : SummaryApi.filterProduct.method,
      //   headers : {
      //     'content-type' : 'application/json'
      //   },
      //   body : JSON.stringify({
      //     category : filterCategoryList
      //   })
      // })
      //
      // const dataResponse = await response.json()
      // setData(dataResponse?.data || [])
      const filteredProducts = filterCategoryList.flatMap((category) =>
        getLocalProductsByCategory(category)
      )
      const uniqueProducts = Array.from(
        new Map(filteredProducts.map((product) => [product._id, product])).values()
      )
      setData(uniqueProducts)
      setLoading(false)
    }

    useEffect(() => {
      fetchAllCategories()
      if(showAll) {
        fetchAllProducts()
      }
    }, [showAll])

    const handleSelectCategory = (e) => {
      const {name, value, checked} = e.target
      setSelectCategory((preve)=>{
        return{
          ...preve,
          [value] : checked
      }
      })
    }

    useEffect(()=>{
      if(filterCategoryList.length > 0) {
        fetchData()
      } else if (!showAll) {
        setData([])
      }
    },[filterCategoryList, showAll])

    useEffect(()=>{
      const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName =>{
       if(selectCategory[categoryKeyName]){
        return categoryKeyName
       }
       return null
      }).filter(el => el)

      setFilterCategoryList(arrayOfCategory)

      // format for url change when change on the checkbox
      const urlFormat = arrayOfCategory.map((el, index) => {
        if((arrayOfCategory.length - 1 ) === index){
          return `category=${el}`
        }
        return `category=${el}&&`
      })

      if (arrayOfCategory.length > 0) {
        navigate("/product-category?"+urlFormat.join(""))
      } else if (showAll) {
        navigate("/product-category?all=true")
      } else {
        navigate("/product-category")
      }
    },[selectCategory])

    const handleOnChangeSortBy = (e) => {
      const { value} = e.target

      setSortBy(value)

      if(value === 'asc'){
        setData(preve => [...preve].sort((a,b)=> a.sellingPrice - b.sellingPrice))
      }

      if(value === 'dsc'){
        setData(preve => [...preve].sort((a,b)=> b.sellingPrice - a.sellingPrice))
      }
    }
    
  return (
    <div className='container mt-[100px] mx-auto p-4 max-w-7xl'>
      <div className='flex flex-col lg:grid lg:grid-cols-[240px,1fr] gap-8'>
        {/* left side - Filters */}
        <div className={`bg-white border-2 border-slate-100 p-6 lg:min-h-[calc(100vh-120px)] ${(filterCategoryList.length === 0 && !showAll) ? 'hidden lg:block' : 'block'}`}>
          {/* sort by  */}
          <div className='mb-8'>
            <h3 className='text-xs font-black uppercase tracking-[0.2em] text-slate-950 border-b-2 border-slate-950 pb-2 mb-4'>Sort by</h3>
            <form className='text-xs font-bold uppercase tracking-widest flex flex-col gap-3 py-2'>
              <div className='flex items-center gap-3 cursor-pointer group'>
                <input type='radio' name='sortBy'
                  className='w-4 h-4 accent-slate-950'
                  checked={sortBy === 'asc'}
                  onChange={handleOnChangeSortBy}
                  value={"asc"} 
                  id="sort-asc" />
                <label htmlFor="sort-asc" className='cursor-pointer group-hover:text-orange-600 transition-colors'>Price - Low to High</label>
              </div>

              <div className='flex items-center gap-3 cursor-pointer group'>
                <input type='radio' name='sortBy'
                  className='w-4 h-4 accent-slate-950'
                  checked={sortBy === 'dsc'}
                  onChange={handleOnChangeSortBy}
                  value={"dsc"}
                  id="sort-dsc"
                />
                <label htmlFor="sort-dsc" className='cursor-pointer group-hover:text-orange-600 transition-colors'>Price - High to Low</label>
              </div>
            </form>
          </div>

          {/* filter by  */}
          <div>
            <h3 className='text-xs font-black uppercase tracking-[0.2em] text-slate-950 border-b-2 border-slate-950 pb-2 mb-4'>Category</h3>
            <form className='text-xs font-bold uppercase tracking-widest flex flex-col gap-3 py-2'>
              {
                productCategoryOptions.map((categoryName, index) => {
                  return (
                    <div className='flex items-center gap-3 cursor-pointer group' key={index}>
                      <input type='checkbox' name={"category"}
                        className='w-4 h-4 accent-slate-950 rounded-none'
                        checked={selectCategory[categoryName?.value]}
                        id={categoryName?.value}
                        value={categoryName?.value}
                        onChange={handleSelectCategory} />

                      <label htmlFor={categoryName?.value} className='cursor-pointer group-hover:text-orange-600 transition-colors'>
                        {categoryName?.label}
                      </label>
                    </div>
                  )
                })
              }
            </form>
          </div>
        </div>

        {/* right side - Content */}
        <div className='w-full'>
          {
            (filterCategoryList.length === 0 && !showAll) ? (
              <div className='w-full'>
                <div className="mb-8 border-b-2 border-slate-100 pb-4">
                  <h2 className='text-2xl md:text-4xl font-black uppercase tracking-tighter text-slate-950 text-center lg:text-left'>Shop by Category</h2>
                  <p className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-widest text-center lg:text-left">Select a collection to browse</p>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
                  {
                    loading ? (
                      new Array(8).fill(null).map((_, index) => (
                        <div key={index} className='bg-white border-2 border-slate-100 overflow-hidden animate-pulse'>
                          <div className='aspect-square bg-white'></div>
                          <div className='p-4'>
                            <div className='h-4 bg-slate-50 rounded-none w-2/3 mx-auto'></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      categories.map((category, index) => (
                        <Link
                          to={`/product-category?category=${category.category}`}
                          key={index}
                          className='group bg-white border-2 border-slate-100 hover:border-orange-500 transition-all overflow-hidden text-center flex flex-col'
                          onClick={() => setSelectCategory({ [category.category]: true })}
                        >
                          <div className='aspect-square overflow-hidden bg-white p-4 flex items-center justify-center relative'>
                            <img
                              src={category?.productImage?.[0]}
                              alt={category.category}
                              className='max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700'
                            />
                            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className='p-4 mt-auto'>
                            <h3 className='text-xs font-black uppercase tracking-widest text-slate-950 group-hover:text-orange-600 transition-colors truncate'>
                              {category.category}
                            </h3>
                          </div>
                        </Link>
                      ))
                    )
                  }
                </div>
              </div>
            ) : (
              <>
                <div className='flex items-center justify-between mb-8 border-b-2 border-slate-100 pb-4'>
                  <p className='text-xs font-black uppercase tracking-[0.2em] text-slate-950'>
                    {showAll && filterCategoryList.length === 0 ? "All Products" : "Filtered Drops"} : <span className="text-orange-600">{data.length} ITEMS</span>
                  </p>
                  <button
                    onClick={() => {
                      setSelectCategory({});
                      navigate("/product-category");
                    }}
                    className='bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-colors'
                  >
                    Clear All
                  </button>
                </div>
                <div className='min-h-[calc(100vh-120px)]'>
                  {
                    data.length !== 0 ? (
                      <VerticalCard data={data} loading={loading} />
                    ) : (
                      !loading && (
                        <div className='flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-100'>
                          <p className='text-xs font-black uppercase tracking-[0.3em] text-slate-400'>No drops found in this category</p>
                        </div>
                      )
                    )
                  }
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default CategoryProduct
