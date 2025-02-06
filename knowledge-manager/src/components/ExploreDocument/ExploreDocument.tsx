import './ExploreDocument.css';

const ExploreDocument = () => {

  return (
    <div className="container">
      <h1>Explore Documents</h1>
      <p className="description">
        Browse through your processed uploaded documents
      </p>
{/* 
      {error && (
        <div className="error-message">
          {error}
        </div>
      )} */}

      <div className="grid-container">
        <table className="content-grid">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Author</th>
              <th>Processed Date</th>
              <th>Duration</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          {/* <tbody>
            {gridItems.length === 0 && !loading ? (
              <tr className="empty-row">
                <td colSpan={6}>No content found</td>
              </tr>
            ) : (
              gridItems.map((item, index) => (
                <tr 
                  key={item.key}
                  ref={index === gridItems.length - 1 ? lastItemRef : undefined}
                  className="grid-row"
                >
                  <td>
                    <a 
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      {item.title}
                    </a>
                  </td>
                  <td>{getTypeDisplay(item.type)}</td>
                  <td>{item.author}</td>
                  <td>{item.processedDate}</td>
                  <td>{item.duration || '-'}</td>
                  <td className="actions-column">
                  <button 
                    className="action-button view-button"
                    onClick={() => handleView(item.id, item.type)}
                    title={item.summary}
                >
                    View
                </button>
                    <button 
                      className="action-button delete-button"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody> */}
        </table>
      </div>
    </div>
  );
};

export default ExploreDocument;