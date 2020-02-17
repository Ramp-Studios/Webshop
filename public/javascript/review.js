async function writeReview(product, rating, writer, review) {
    const data = JSON.stringify({
        product: product,
        rating: rating,
        writer: writer,
        review: review
    })
    await fetch((`./api/review`), {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    });
    console.log(data);
    console.log('posted review')
}