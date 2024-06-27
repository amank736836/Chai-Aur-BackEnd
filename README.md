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
