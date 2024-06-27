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
