import Contribution from "../schema/contributionSchema.js";
import Student from "../schema/studentSchema.js";
import Developer from "../schema/developerSchema.js";

const addContribution = async (req, res) => {
  try {
    const { userId, userType, prLink, prNumber, repoName, projectId } =
      req.body;

    const newContribution = new Contribution({
      userId,
      userType,
      prLink,
      prNumber,
      repoName,
      projectId,
    });

    const saved = await newContribution.save();

    res.status(201).json({
      success: true,
      message: "Contribution added",
      contribution: saved,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add contribution",
      error: err.message,
    });
  }
};

const githubWebhookHandler = async (req, res) => {
  try {
    const payload = req.body;

    // Check if it's a pull_request event and the PR was merged
    if (
      payload.pull_request &&
      payload.pull_request.merged === true &&
      payload.pull_request.number &&
      payload.repository &&
      payload.repository.name
    ) {
      const prNumber = payload.pull_request.number;
      const repoName = payload.repository.name.trim().toLowerCase();

      const updated = await Contribution.findOneAndUpdate(
        { prNumber, repoName },
        { status: "merged" },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "PR merged and status updated",
        updated,
      });
    }

    res.status(200).json({ message: "Webhook received but not a merged PR" });
  } catch (err) {
    res.status(500).json({ message: "Error in webhook", error: err.message });
  }
};

const getAllContributions = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Group by userId and userType to count total contributions
    const contributions = await Contribution.aggregate([
      {
        $group: {
          _id: { userId: "$userId", userType: "$userType" },
          contributions: { $sum: 1 },
        },
      },
      {
        $sort: { contributions: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
    ]);

    // Fetch user details (name, bio, profilePicture) for each user
    const enriched = await Promise.all(
      contributions.map(async (contributor) => {
        const { userId, userType } = contributor._id;

        let user = null;
        if (userType === "Student") {
          user = await Student.findById(userId).select("name bio profilePicture");
        } else if (userType === "Developer") {
          user = await Developer.findById(userId).select("name bio profilePicture");
        }

        return {
          userId,
          userType,
          contributions: contributor.contributions,
          name: user?.name || "Unknown",
          bio: user?.bio || "",
          profilePicture: user?.profilePicture || "",
        };
      })
    );

    res.status(200).json({
      success: true,
      page,
      limit,
      contributors: enriched,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// const getAllContributions = async (req, res) => {
//   try {
//     const contributions = await Contribution.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, contributions });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

const getTopContributors = async (req, res) => {
  try {
    const agg = await Contribution.aggregate([
      { $match: { status: "merged" } },
      {
        $group: {
          _id: { userId: "$userId", userType: "$userType" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const populated = await Promise.all(
      agg.map(async ({ _id, count }) => {
        const model = _id.userType === "Student" ? Student : Developer;
        const user = await model.findById(_id.userId);
        return {
          userId: _id.userId,
          userType: _id.userType,
          name: user?.name || "",
          bio: user?.bio || "",
          profilePicture: user?.profilePicture || "",
          contributions: count,
        };
      })
    );

    res.status(200).json({ success: true, leaderboard: populated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getContributionsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const contributions = await Contribution.find({
      projectId,
      status: "merged",
    });
    res.status(200).json({ success: true, contributions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export {
  addContribution,
  getTopContributors,
  githubWebhookHandler,
  getAllContributions,
  getContributionsByProjectId,
};
