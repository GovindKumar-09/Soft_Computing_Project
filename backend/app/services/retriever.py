def create_retriever(vector_store, video_id, username):

    retriever = vector_store.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 4,
            "fetch_k": 20,
            "lambda_mult": 0.5,
            "filter": {
                "video_id": {"$eq": video_id},
                "username": {"$eq": username}
            }
        }
    )

    return retriever