import { Box, Button, Card, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

const packages = [
  "Bronze", "Silver", "Gold", "Platinum"
]

const PricingForm = (props) => {
  const [selectedPackage, setSelectedPackage] = useState("Gold");

  return (
    <div className="py-5">
      <h3 className="text-center my-4">Select a package</h3>
      <Box>
        <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
          {packages.map((p) =>
            <Card key={p} className={selectedPackage === p && "packages selected"}
              sx={{ mx: 2 }}>
              <Box sx={{ py: 5, px: 5, justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>{p}</Typography>
                <Box sx={{ mt: 3 }}>
                  <ul style={{ listStyle: 'none', marginLeft: "-2rem" }}>
                    <li>Lorem</li>
                    <li>Sit amet dolar</li>
                    <li>Lorem twaf twa </li>
                    <li>Lorem</li>
                  </ul>
                </Box>
                <div className="d-flex justify-content-center">
                  <Button onClick={() => setSelectedPackage(p)} color="secondary" variant="contained"
                    disabled={selectedPackage === p}
                    sx={{ mt: 10 }}>{selectedPackage === p ? "Selected" : "Select"}</Button>
                </div>
              </Box>
            </Card>
          )}
        </Stack>
      </Box>
    </div >
  )
}


export default PricingForm