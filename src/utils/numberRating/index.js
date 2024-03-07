export const valueRating = rating => {
  // Menghitung total penilaian dengan bobot
  var totalRatingdenganReview = 0;
  var review = 0;

  for (var i = 0; i < rating.length; i++) {
    totalRatingdenganReview += (i + 1) * rating[i];
    review += rating[i];
  }
  // Menghitung rata-rata penilaian dengan bobot
  var rataRataPenilaianDenganBobot = totalRatingdenganReview / review;

  return rataRataPenilaianDenganBobot
    ? rataRataPenilaianDenganBobot.toFixed(1)
    : '0.0';
};

export const totalReview = rating => {
  var review = 0;

  for (var i = 0; i < rating.length; i++) {
    review += rating[i];
  }
  return review;
};
