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
  const proxyPrefix = "https://corsproxy.io/?url=";

  const fetchData = async (pageNumber = page) => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${pageNumber}&pageSize=${props.pageSize}`;
    const fetchUrl = `${proxyPrefix}${encodeURIComponent(url)}`;
    setLoading(true);

    try {
      const response = await fetch(fetchUrl);
      props.setProgress(40);
      const pd = await response.json();
      props.setProgress(80);

      console.log(pd);
      setArticles(pd.articles ?? []);
      setTotalResults(pd.totalResults ?? 0);
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchData(nextPage);
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
        NewsMonkey - Top {capitalise(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((el) => (
              <div className="col-md-4" key={el.url}>
                <NewsItem
                  title={el.title || ""}
                  description={el.description || ""}
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
