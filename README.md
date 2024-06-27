# Chai Aur BackEnd
 Learning BackEnd

# Chai Aur MongoDB aggregation
 learning Complete MongoDB aggregation pipeline

#############################################
## Notes

### How may users are active ?

[
  {
    $match: {
      isActive: true,
    },
  },
  {
    $count: "activeUsers",
  },
]

### What is the average age of all users ?

[
  {
    $group: {
      _id: null,
      averageAge : {
        $avg : "$age"
      }
    }
  },
]

### List the top 5 most common fruit among users.

[
  {
    $group: {
      _id: "$favoriteFruit",
      count : {
        $sum : 1
      },
      // count2 : {
      //   $count : {}
      // }+
    }
  },
  {
    $sort: {
      count : -1
    }
  },
  {
    $limit: 5
  }
]

### Find the total number of males and females.

[
  {
    $group: {
      _id: "$gender",
      genderCount : {
        $sum : 1
      }
      // genderCount : {
      //   $count : {}
      // }
    }
  }
]

### Which country has the highest number of registered users ?

[
  {
    $group: {
      _id: "$company.location.country",
      userCount : {
        $sum : 1
      },
      // userCount2 : {
      //   $count : {}
      // }
    }
  },
  {
    $sort: {
      userCount: -1
      // userCount: 1
    }
  },
  {
    $limit: 1
  }
]

### List all unique eye colors present in the collection.

[
  {
    $group: {
      _id: "$eyeColor",
      count : {
        $sum : 1
      }
    }
  },
  {
    $sort: {
      count: -1
    }
  }
]

### What is the average number of tags per user ?

[
  {
    $unwind: "$tags"
    // $unwind: {
    //   path: "$tags"
    // }
  },
  {
    $group: {
      _id: "$_id",
       numberOfTags : {
         $sum : 1
       }
    }
  },
  {
    $group: {
      _id: null,
      averageNumberOfTags : {
        $avg : "$numberOfTags"
      }
    }
  }
]

OR

[
  {
    $addFields: {
      numberOfTags : {
        // $size : "$tags",
        $size : {
          $ifNull : ["$tags" , []]
        }
      }
    }
  },
  {
    $group: {
      _id: null,
      averageNumberOfTags : {
        $avg : "$numberOfTags"
      }
    }
  }
]

### How many users have 'enim' as one of their tags ?

[
  {
    $match: {
      tags : "enim"
    }
  },
  {
    $count: 'userWithEnimTag'
  }
]

### What are the names and age of users who are inactive and have 'velit' as tag ?

[
  {
    $match: {
      tags : "velit",
      isActive : false
    }
  },
  {
    $project: {
      name : 1,
      age : 1,
    }
  },
]

### How many users have a phone number starting with '+1 (940)' ?

[
  {
    $match: {
      "company.phone" : /^\+1 \(940\)/
    }
  },
  {
    $count: 'usersWithSpecialPhoneNumber'
  }
]

### Who has registered most recently ?

[
  {
    $sort: {
      registered : -1
    }
  },
  {
    $limit: 4
  },
  {
    $project: {
      name : 1,
      registered : 1,
      favoriteFruit : 1
    }
  }
]

### Categorize users by their favorite fruit

[
  {
    $group: {
      _id: "$favoriteFruit",
      users : {
        $push : "$name"
      }
    }
  }
]

### How many users have 'ad' as the second tag in their list of tags ?

[
  {
    $match: {
      "tags.1" : "ad"
    }
  },
  {
    $count: 'secondTagAd'
  }
]

### Find users who have both 'enim' and 'id' as their tags.

[
  {
    $match: {
      tags : {
        $all : ["enim" , "id"]
      }
    }
  }
]

### List all companies located in the USA with their corresponding user count.

[
  {
    $match: {
      "company.location.country" : "USA"
    }
  },
  {
    $group: {
      _id: "$company.title",
      userCount : {
        $sum : 1
      }
    }
  },
  {
    $sort: {
      userCount: -1
    }
  }
]

### lookup

[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details"
    }
  },
  {
    $addFields: {
      author_details: {
        // $first : "$author_details",
        $arrayElemAt : ["$author_details",0]
      }
    }
  }
]