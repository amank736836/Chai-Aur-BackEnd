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
