import {getUserPages, updateUserCurrentPage} from '../services/userPageTrackerService.js';


export const handleUserPages = async (req, res) => {
    try{
    const slug = req.params.slug;
    const query = req.query.pageNum;
    const userid = req.user.id;
    const userPages = await getUserPages(userid, slug);

    res.status(200).json(userPages);

    }catch(err) {
        res.status(400).json({ error: err.message });
    }
}


export const handleUpdateUserPage = async (req, res) => {
    try {
      const userid = req.user.id;
      const newPageNumber= req.body.newPageNumber;
      const slug = req.params.slug;
  
      await updateUserCurrentPage(userid, slug, newPageNumber);
  
      res.status(200).json({ message: "User page updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };