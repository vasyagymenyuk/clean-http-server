exports.index = async (req, res) => {
  const schedule = {
    startDate: "2022-09-01",
    endDate: "2022-09-30",
    meets: [],
  };

  return res.json(schedule);
};

exports.create = async (req, res) => {
  return res.json({
    message: "created",
  });
};
