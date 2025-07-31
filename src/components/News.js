import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const proxy = "https://cors-anywhere.herokuapp.com/";

  const updateNews = async () => {
    props.setProgress(10);
    const url = `${proxy}https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    try {
      const response = await fetch(url);
      props.setProgress(40);
      const pd = await response.json();
      props.setProgress(80);

      console.log(pd);
      setArticles(pd.articles ?? []);           // fallback to empty array
      setTotalResults(pd.totalResults ?? 0);   // fallback to zero
    } catch (err) {
      console.error("Error fetching news:", err);
      setArticles([]);
      setTotalResults(0);
    }
    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalise(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    const url = `${proxy}https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
    setPage(nextPage);
    try {
      const response = await fetch(url);
      const pd = await response.json();
      console.log(pd);
      setArticles(prev => prev.concat(pd.articles ?? []));
      setTotalResults(pd.totalResults ?? totalResults);
    } catch (err) {
      console.error("Error loading more news:", err);
    }
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
        NewsMonkey - Top {capitalise(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles?.length || 0}
        next={fetchMoreData}
        hasMore={(articles?.length ?? 0) < (totalResults ?? 0)}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {(articles ?? []).map((el) => (
              <div className="col-md-4" key={el.url}>
                <NewsItem
                  title={el.title ?? ""}
                  description={el.description ?? ""}
                  imageUrl={el.urlToImage}
                  newsUrl={el.url}
                  author={el.author}
                  date={el.publishedAt}
                  source={el.source?.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

export default News;
