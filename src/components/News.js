import React,{useEffect,useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import InfiniteScroll from "react-infinite-scroll-component";

//import PropTypes from 'prop-types'

const News =(props)=> {
  const [articles,setArticles]= useState([])
  const [loading,setLoading]= useState(true)
  const [page,setPage]= useState(1)
  const [totalResults,setTotalResults]= useState(0)
  
 const capitalise=(string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1)
  }
   
    
    // this.state={
    //   articles: [],
    //   loading: true,
    //   page:1,
    //   totalResults:0
    // }
    
  
  const updateNews=async()=>{
    props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?domains=wsj.comcountry=${props.country}&category=${props.category}&apikey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data= await fetch(url)
    props.setProgress(40)
    let pd=await data.json()
    props.setProgress(80)
    console.log(pd)
    setArticles(pd.articles)
    setTotalResults(pd.totalResults)
    setLoading(false)
    props.setProgress(100)
    //console.log("Requested pageSize:", this.props.pageSize, " | Articles received:", pd.articles.length);
  }
  useEffect(()=>{
    document.title=`${capitalise(props.category)} - NewsMonkey`
    updateNews()
  },[])
  
  const handlePrevClick=async()=>{
    setPage(page-1)
    updateNews()
  }
 const handleNextClick=async()=>{
    setPage(page+1)
    updateNews()
  }
  const fetchMoreData =async() => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data= await fetch(url)
    let pd=await data.json()
    console.log(pd)
    setArticles(articles.concat(pd.articles))
    setTotalResults(pd.totalResults)
   
  };

  
    return (
      <>
        <h1 className="text-center" style={{margin: '35px 0px',marginTop: '90px'}}>NewsMonkey - Top {capitalise(props.category)} Headlines </h1>
       {loading && <Spinner/>}
       <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
         
        <div className="row">
          {articles.map((element)=>{
          return <div className="col-md-4" key={element.url}>
                    <NewsItem  title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage}
                    newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
        })}
          </div>
             
          </div>
          </InfiniteScroll>
          {/* <div className="container d-flex justify-content-between">
            <button disabled={this.state.page<=1}type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
            <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)}type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
          </div> */}
      </>
    )
  
}
  //  NewsdefaultProps={
  //   country: 'us',
  //   pageSize: 5,
  //   category: 'general'
  // }
  // News. propTypes={
  //   country: PropTypes.string,
  //   pageSize:PropTypes.number,
  //   category: PropTypes.string
  // }
export default News
