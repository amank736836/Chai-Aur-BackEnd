# Chai Aur BackEnd ☕️
## Learning BackEnd Development

---

# Chai Aur MongoDB Aggregation 🍵
## Learning the Complete MongoDB Aggregation Pipeline

---

## Notes 📒

### How many users are active? 👥

```javascript
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
```

### What is the average age of all users? 🎂

```javascript
[
  {
    $group: {
      _id: null,
      averageAge: {
        $avg: "$age",
      },
    },
  },
]
```

### List the top 5 most common fruits among users. 🍎🍌🍇

```javascript
[
  {
    $group: {
      _id: "$favoriteFruit",
      count: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      count: -1,
    },
  },
  {
    $limit: 5,
  },
]
```

### Find the total number of males and females. 🚹🚺

```javascript
[
  {
    $group: {
      _id: "$gender",
      genderCount: {
        $sum: 1,
      },
    },
  },
]
```

### Which country has the highest number of registered users? 🌍

```javascript
[
  {
    $group: {
      _id: "$company.location.country",
      userCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      userCount: -1,
    },
  },
  {
    $limit: 1,
  },
]
```

### List all unique eye colors present in the collection. 👁️

```javascript
[
  {
    $group: {
      _id: "$eyeColor",
      count: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      count: -1,
    },
  },
]
```

### What is the average number of tags per user? 🏷️

#### Method 1:

```javascript
[
  {
    $unwind: "$tags",
  },
  {
    $group: {
      _id: "$_id",
      numberOfTags: {
        $sum: 1,
      },
    },
  },
  {
    $group: {
      _id: null,
      averageNumberOfTags: {
        $avg: "$numberOfTags",
      },
    },
  },
]
```

#### Method 2:

```javascript
[
  {
    $addFields: {
      numberOfTags: {
        $size: {
          $ifNull: ["$tags", []],
        },
      },
    },
  },
  {
    $group: {
      _id: null,
      averageNumberOfTags: {
        $avg: "$numberOfTags",
      },
    },
  },
]
```

### How many users have 'enim' as one of their tags? 🏷️

```javascript
[
  {
    $match: {
      tags: "enim",
    },
  },
  {
    $count: 'userWithEnimTag',
  },
]
```

### What are the names and ages of users who are inactive and have 'velit' as a tag? 🚫🏷️

```javascript
[
  {
    $match: {
      tags: "velit",
      isActive: false,
    },
  },
  {
    $project: {
      name: 1,
      age: 1,
    },
  },
]
```

### How many users have a phone number starting with '+1 (940)'? 📞

```javascript
[
  {
    $match: {
      "company.phone": /^\+1 \(940\)/,
    },
  },
  {
    $count: 'usersWithSpecialPhoneNumber',
  },
]
```

### Who has registered most recently? 🕒

```javascript
[
  {
    $sort: {
      registered: -1,
    },
  },
  {
    $limit: 4,
  },
  {
    $project: {
      name: 1,
      registered: 1,
      favoriteFruit: 1,
    },
  },
]
```

### Categorize users by their favorite fruit. 🍉🍊🍋

```javascript
[
  {
    $group: {
      _id: "$favoriteFruit",
      users: {
        $push: "$name",
      },
    },
  },
]
```

### How many users have 'ad' as the second tag in their list of tags? 🏷️

```javascript
[
  {
    $match: {
      "tags.1": "ad",
    },
  },
  {
    $count: 'secondTagAd',
  },
]
```

### Find users who have both 'enim' and 'id' as their tags. 🏷️

```javascript
[
  {
    $match: {
      tags: {
        $all: ["enim", "id"],
      },
    },
  },
]
```

### List all companies located in the USA with their corresponding user count. 🇺🇸🏢

```javascript
[
  {
    $match: {
      "company.location.country": "USA",
    },
  },
  {
    $group: {
      _id: "$company.title",
      userCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      userCount: -1,
    },
  },
]
```

### Lookup Operation 🔍

```javascript
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details",
    },
  },
  {
    $addFields: {
      author_details: {
        $arrayElemAt: ["$author_details", 0],
      },
    },
  },
]
```