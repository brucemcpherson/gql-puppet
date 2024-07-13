# the secret name
SECRET=echo 

# show the current secret value into an env
# this should be executed as . ./shellto hoist the result
CONFIG=$(gcloud secrets versions access latest --secret=${SECRET}) 
export CONFIG